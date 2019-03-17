var projection_view_ns = {
	hello: 1
}

function init_projection_view () {
	d3.csv("data/tsne-results.csv", d=>{
		return {
			x: +d.x,
			y: +d.y,
			index: d.index
		}
	}, (error, projection_position)=>{
		var projection_width  = $("#middle_view_svg_0").width(),
		    projection_height = $("#middle_view_svg_0").height(),
			x_scale = d3.scaleLinear()
			            .domain([d3.min(projection_position, d=>d["x"]), d3.max(projection_position, d=>d["x"])])
			            .range([1, projection_width - 1]),
			y_scale = d3.scaleLinear()
			            .domain([d3.min(projection_position, d=>d["y"]), d3.max(projection_position, d=>d["y"])])
			            .range([projection_height - 1, projection_height / 2 - 1]);

		console.log(projection_width, projection_height)
		console.log(projection_position)
		console.log(d3.min(projection_position, d=>d["x"]))
		console.log(d3.min(projection_position, d=>d["y"]))

		d3.select("#middle_view_svg_0")
		  .selectAll(".tsne-dots")
		  .data(projection_position)
		  .enter()
		  .append("circle")
		  .attr("class", d=>"tsne-dots tsne-dots-" + d.index)
		  .attr("r", 2)
		  .attr("cx", d=>x_scale(d.x))
		  .attr("cy", d=>y_scale(d.y))
		  .style("fill", "stone")
		  .style("stroke", "none")
	})
}