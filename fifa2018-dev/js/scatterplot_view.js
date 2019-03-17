var scatter_plot_ns = {

}

function init_scatter_plot_view() {
	var axis_names = null;
	var x_scale = null, y_scale = null;
	d3.csv("data/FIFA_2018_Statistics.csv", d=>{
		return {
			date: d.Date,
			scored_raw: +d["Goal Scored"],
			scored: +d["Goal Scored"],// + Math.random()*0.4 - 0.2,
			name: d.Team,
			opponent: d.Opponent,
			possession: +d["Ball Possession %"],
			target_raw: +d["On-Target"],
			target: +d["On-Target"],// + Math.random()*0.4 - 0.2,
			on_and_off_target_raw: (+d["Off-Target"]) + (+d["On-Target"]),
			attempt: (+d["Off-Target"]) + (+d["On-Target"]),// + Math.random()*0.4 - 0.2
			"fouls committed": +d["Fouls Committed"]
		}
	}, (error, data)=>{
		for (var i = 0; i < data.length; i = i + 1) {
			if (Math.floor(data[i].scored) >= Math.floor(data[i].target)){}
				// console.log("hello")
		}				

		var right_svg_height = $("#right_view_svg_0").height(),
			right_svg_width  = $("#right_view_svg_0").width();
		// var small_svg_height = right_svg_height / 3;

		

		var score_min = Math.min(d3.min(data, d=>d.scored), d3.min(data, d=>d.target)),
		    score_max = Math.max(d3.max(data, d=>d.scored), d3.max(data, d=>d.target))
		// var scored_scale = d3.scaleLinear().domain([0, score_max]).range([3, small_svg_width - 3])
		// var target_scale = d3.scaleLinear().domain([0, score_max]).range([small_svg_width - 3, 3])
		
		var right_view_g = d3.select("#right_view_svg_0")
		  .append("g")
		  .attr("class", "right_view_g")
		  .attr("transform", "translate(0," + 0 + ")")
		
		axis_names = ["scored", "target", "attempt", "possession", "fouls committed"]

		y_scale = d3.scalePoint()
    	  .domain(d3.range(axis_names.length))
    	  .range([3, right_svg_height - 16]);
    	x_scale = []
    	for (var i = 0; i < axis_names.length; i++) {
    		x_scale.push(
    			d3.scaleLinear()
    			  .domain((axis_names[i]=="scored" || axis_names[i]=="target") ? [0, d3.max(data, d=>d["attempt"])] :
    			  		   //[0, score_max] : 
    			  	       axis_names[i]=="attempt" ? [0, d3.max(data, d=>d["attempt"])]
    			  	       : d3.extent(data, d=>d[axis_names[i]]))
    			  .range([6, right_svg_width - 6])
    		)
    	}
    	console.log(x_scale)

    	var axis = d3.axisBottom();

    	var axes = d3.select("#right_view_svg_0").selectAll(".axis_up")
    	  .data(d3.range(axis_names.length))
  		  .enter().append("g")
    	  .attr("class", function(d) { return "axis_up axis_up_" + d; }) // .replace(/ /g, "_")
    	  .attr("transform", function(d,i) { return "translate(0," + y_scale(i) + ")"; });

    	var background = d3.select("#right_view_svg_0")
    	  .append("g")
    	  .attr("class", "background")
    	  .selectAll("path")
    	  .data(data)
    	  .enter().append("path")
    	  .attr("d", path_function)
    	  .style("fill", "none")
    	  .style("stroke", "grey")
    	  .style("opacity", 0.3)
    	  
    	var foreground = d3.select("#right_view_svg_0")
    	  .append("g")
    	  .attr("class", "foreground")
    	  .selectAll("path")
    	  .data(data)
    	  .enter().append("path")
    	  .attr("d", path_function)
    	  .style("fill", "none")
    	  .style("stroke", "SKYBLUE")
    	  .attr("class", d=>"win_loss_path_" + d.date + "_" + d.name + "_" + d.opponent)

		axes.append("g")
      	 .attr("class", "axis")
      	 .each(function(d) {d3.select(this).call(axis.scale(x_scale[d])); })
    	axes.append("text")
         .style("text-anchor", "end")
         .attr("y", (d,i)=>(i == axis_names.length - 1) ? -10 : 30)
         .attr("x", right_svg_width - 6)
         .text(function(d) { return axis_names[d]; })
         .on("mouseover", d=>{

         })

        var x_brush = {}
        axes.append("g")
          .attr("class", "para-brush")
          .each(function(d) {
          	d3.select(this).call(x_brush[d] = d3.brushX().extent([[0, -8], [right_svg_width, 8]])
          		// .on("brushstart", brushstart)
          		.on("brush", brush))
          		.on("end", brushend);
          })
          .selectAll("rect")
          .attr("y", -8)
          .attr("height", 16);
		// right_up_g = d3.select("#right_view_svg_0")
		//   .append("g")
		//   .attr("class", "right_view_up_g")
		//   .attr("transform", "translate(0," + 0 + ")")
		// right_middle_g = d3.select("#right_view_svg_0")
		//   .append("g")
		//   .attr("class", "right_view_up_g")
		//   .attr("transform", "translate(0," + small_svg_width + ")")
		// right_bottom_g = d3.select("#right_view_svg_0")
		//   .append("g")
		//   .attr("class", "right_view_up_g")
		//   .attr("transform", "translate(0," + (small_svg_width*2) + ")")
		// right_up_g.selectAll("circle")
		//   .data(data)
		//   .enter()
		//   .append("circle")
		//   .attr("cx", d=>target_scale(d.target))
		//   .attr("cy", d=>scored_scale(d.scored))
		//   .attr("r", 3)
		//   .style("fill", "steelblue")
		//   .on("click", d=>{console.log(d)})

		function brushstart() {
			d3.event.sourceEvent.stopPropagation();
		}

		function brush(d) {
			// console.log(d3.event.selection)
			// if (d3.event.selection === null) {
			// 		console.log("yes")
			// 		foreground.style("display", function(dd) {
		 //  				return null
  	// 				});
			// 		return;
			// }
  			foreground.style("display", function(dd) {
  				//console.log(x_scale[d])
  				if (d3.event.selection[0] <= x_scale[d](dd[axis_names[d]]) && d3.event.selection[1] >= x_scale[d](dd[axis_names[d]]))
  					console.log(".win_loss_whole_bar_" + dd.date + "_" + dd.name + "_" + dd.opponent)
  				// if (d3.event.selection[0] <= x_scale[d](dd[axis_names[d]]) && d3.event.selection[1] >= x_scale[d](dd[axis_names[d]]))
  				// 	select_matrix(dd, null)
  				// else
  				// 	select_matrix(dd, "none")
  				return d3.event.selection[0] <= x_scale[d](dd[axis_names[d]]) && d3.event.selection[1] >= x_scale[d](dd[axis_names[d]]) ? null : "none";
    			// return actives.every(function(p, i) {
      			// return extents[i][0] <= d[axis_names[p]] && d[axis_names[p]] <= extents[i][1];
    			// }) ? null : "none";
  			});

  			select_matrix(d3.event.selection, x_scale, foreground, d, axis_names)
		}

		function brushend(d) {
			// console.log("end_d", d)
			// console.log(d3.event.selection)
			forground.each(function(dd){
				if (d3.event.selection[0] <= x_scale[d](dd[axis_names[d]]) && d3.event.selection[1] >= x_scale[d](dd[axis_names[d]]))
					console.log("end", dd)
			})
		}
	})

	function path_function(datum) {
		var line = d3.line()
    	  .x(function(d) { return d[1]; }) // set the x values for the line generator
    	  .y(function(d) { return d[0] }) // set the y values for the line generator 
    	  // .curve(d3.curveMonotoneX)
    	  // .curve(d3.curveBasis)
    	// console.log("datum", datum)
		return line((d3.range(axis_names.length)).map(function(p) { return [y_scale(p), x_scale[p](datum[axis_names[p]])]; }));
		
	}
}

function select_matrix(event, x_scale, foreground, d, axis_names) {
	// console.log(".win_loss_bar_" + d.date + "_" + d.name + "_" + d.opponent)
	foreground.each(function(dd){
		if (event[0] <= x_scale[d](dd[axis_names[d]]) && d3.event.selection[1] >= x_scale[d](dd[axis_names[d]]))
			d3.select("#middle_view_svg_0")
	  		  .select(".win_loss_whole_bar_" + dd.date + "_" + dd.name + "_" + dd.opponent)
	  		  .style("display", null)
	  	else
	  		d3.select("#middle_view_svg_0")
	  		  .select(".win_loss_whole_bar_" + dd.date + "_" + dd.name + "_" + dd.opponent)
	  		  .style("display", "none")
	})
	
}