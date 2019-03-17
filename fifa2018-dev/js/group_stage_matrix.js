var group_stage_matrix_ns = {
	"team_names": [
		"Russia",       "Saudi_Arabia",         "Egypt",          "Uruguay",
        "Portugal",     "Spain",                "Morocco",        "Iran",
		"France",       "Australia",            "Peru",           "Denmark",
		"Argentina",    "Iceland",              "Croatia",        "Nigeria",
		"Brazil",       "Switzerland",          "Costa_Rica",     "Serbia",
		"Germany",      "Mexico",               "Sweden",         "Korea_Republic",
		"Belgium",      "Panama",               "Tunisia",        "England",
		"Poland",       "Senegal",              "Colombia",       "Japan"
	]
}

function init_group_stage_matrix() {

	d3.csv("data/FIFA_2018_Statistics.csv", d=>{return {
		date: d.Date,
		win: (+d.win) / 100,
		tie: (100-(+d.win)-(+d.loss)) / 100,
		loss: (+d.loss) / 100,
		"Goal Scored": d["Goal Scored"],
		name: d.Team,
		opponent: d.Opponent
	}}, (error, group_match)=>{
		console.log("group_match", group_match)
		var width = $("#middle_view_svg_0").width(),
			height = $("#middle_view_svg_0").height();

		var group_match_win_tie_loss = []
		var team_matches = {}
		for (var i = 0; i < group_match.length; i = i + 2) {
			var accumalted_prob = 0, accumalted_prob_2 = 0;
			var d1 = group_match[i],
			    d2 = group_match[i+1]
			var is_win_or_loss, result_goal
			if (d1["Goal Scored"] == d2["Goal Scored"]) {
				is_win_or_loss = 1
				result_goal = d1["Goal Scored"]
			}
			else if (d1["Goal Scored"] > d2["Goal Scored"]) {
				is_win_or_loss = 0
				result_goal = d1["Goal Scored"] - d2["Goal Scored"]
			}
			else {
				is_win_or_loss = 2
				result_goal = d2["Goal Scored"] - d1["Goal Scored"]
			}

			var game_info_d1 = [], game_info_d2 = [];
			for (var j = 0; j < 3; j++) {
				accumalted_prob = accumalted_prob + (j == 0 ? 0 : j == 1 ? d1.win : d1.tie)
				accumalted_prob_2 = accumalted_prob_2 + (j == 0 ? 0 : j == 1 ? d1.loss : d1.tie)
				group_match_win_tie_loss.push({
					x_order: j,
					y_order: i,
					percent: j == 0 ? d1.win : j == 1 ? d1.tie : d1.loss,
					win_or_loss: j,
					result_goal: result_goal,
					is_this_result: j == is_win_or_loss,
					accumalted_prob: accumalted_prob
				})

				game_info_d1.push({
					x_order: j,
					percent: j == 0 ? d1.win : j == 1 ? d1.tie : d1.loss,
					win_or_loss: j,
					result_goal: result_goal,
					is_this_result: j == is_win_or_loss,
					accumalted_prob: accumalted_prob
				})


				console.log(j, j == 0 ? d1.loss + d1.tie : j == 1 ? d1.loss : 0, j == 0 ? d1.win : j == 1 ? d1.tie : d1.loss)
				game_info_d2.push({ // 前部插入元素？
					x_order: j, // 这里？
					percent: j == 0 ? d1.loss : j == 1 ? d1.tie : d1.win,
					win_or_loss: j,
					result_goal: result_goal,
					is_this_result: (2-j) == is_win_or_loss,
					// accumalted_prob: j == 0 ? d1.loss + d1.tie : j == 1 ? d1.loss : 0,
					accumalted_prob: j == 0 ? 0 : j == 1 ? d1.loss : d1.loss+d1.tie
				})
			}

			console.log("aass", i, j, game_info_d2)

			if (!(d1.name in team_matches)) {
				team_matches[d1.name] = {number_of_matches: 0, matches:[]}
			}
			team_matches[d1.name]["matches"].push({
				match_of_this_game: team_matches[d1.name]["number_of_matches"],
				date: d1.date,
				name: d1.name,
				opponent: d1.opponent,
				game_info: game_info_d1
			})
			team_matches[d1.name]["number_of_matches"] = team_matches[d1.name]["number_of_matches"] + 1

			if (!(d2.name in team_matches)) {
				team_matches[d2.name] = {number_of_matches: 0, matches:[]}
			}
			team_matches[d2.name]["matches"].push({
				match_of_this_game: team_matches[d2.name]["number_of_matches"],
				date: d2.date,
				name: d2.name,
				opponent: d2.opponent,
				game_info: game_info_d2
			})
			team_matches[d2.name]["number_of_matches"] = team_matches[d2.name]["number_of_matches"] + 1
		}

		// console.log("team_matches", team_matches)
		// console.log("group_match_win_tie_loss", group_match_win_tie_loss)

		var team_matches_list = []
		for (var team_index = 0; team_index < group_stage_matrix_ns.team_names.length; team_index++) {
			team_matches_list[team_index] = {
				"name": group_stage_matrix_ns.team_names[team_index],
				"team_matches": team_matches[group_stage_matrix_ns.team_names[team_index]]
			}
		}
		console.log("team_matches_list", team_matches_list)

		var matrix_height = 26,
			matrix_width = 100,
			matrix_padding_x = 10
		var x_scale = d3.scaleLinear().domain([0,1]).range([0, matrix_width]),
		    // y_scale = d3.scaleLinear().domain([0, group_match.length]).range([, 0]),
		    color_scale = ["BROWN", "GOLD", "LIMEGREEN"],
		    opacity_scale = d3.scaleLinear().domain([0, 8]).range([0.5, 1]);

		// original array of game list
		// console.log(group_match_win_tie_loss)
		// d3.select("#middle_view_svg_0")
		//   .selectAll(".win_loss_bar")
		//   .data(group_match_win_tie_loss)
		//   .enter()
		//   .append("rect")
		//   .attr("class", "win_loss_bar")
		//   .attr("x", d=>x_scale(d.accumalted_prob))
		//   .attr("y", (d,i)=>(matrix_height+1) * (Math.floor(i/3)))
		//   .attr("height", matrix_height)
		//   .attr("width",  d=>matrix_width * d.percent)
		//   .style("fill",  d=>color_scale[d.win_or_loss])
		//   .style("opacity", d=>d.is_this_result?opacity_scale(d.result_goal):0.1)

		var g_win_loss_team = d3.select("#middle_view_svg_0")
		  .selectAll(".win_loss_team_g")
		  .data(team_matches_list)
		  .enter()
		  .append("g")
		  .attr("class", "win_loss_team_g")
		  .attr("transform", (d,i) => "translate(" + 0 + "," + ((matrix_height+1)*i) + ")")

		// not work
		// var g_win_loss_match = g_win_loss_team.selectAll(".win_loss_match_g")
		//   .data(d=>d.team_matches)
		//   .enter()
		//   .append("g")
		//   .attr("class", "win_loss_match_g")
		//   .attr("transform", (d,i) => {
		//   						console.log(d)
		//   						return "translate(" + (i*(matrix_width + matrix_padding_x)) + "," + 0 + ")"
		//   					})
		g_win_loss_team.each(function (d) { // 为什么d=>就出错？？
			// console.log("hello", d3.select(this), this)
			// console.log(d)
			d3.select(this)
			  .selectAll(".win_loss_match_g")
			  .data(d.team_matches.matches)
			  .enter()
			  .append("g")
			  .attr("class", "win_loss_match_g")
			  .attr("transform", (dd,i) => "translate(" + (i*(matrix_width + matrix_padding_x)) + "," + 0 + ")")
		})

		d3.selectAll(".win_loss_match_g")
		  .on("mouseover", function(d) {
		  	console.log("win_loss_match", d)

		  	console.log($(this).css("display"))
		  	var is_display = $(this).css("display")
		  	if (is_display == "none") {
		  		d3.select(this).style("display", null)
		  		d3.select("#country_list_table")
		  		  .select("." + d.opponent)
		  		  .style("width", 40)
		  		  .style("height", 40)
		  	}
		  	else {
		  		// d3.select(this).style("display", "none")
		  		d3.select("#country_list_table")
		  		  .select("." + d.opponent)
		  		  .attr("width", 40)
		  		  .attr("height", 40)
		  		d3.select("#middle_view_svg_0")
	  		      .select(".win_loss_whole_bar_" + d.date + "_" + d.name + "_" + d.opponent)
	  		      .style("display", null)

	  		    d3.select(".win_loss_path_" + d.date + "_" + d.name + "_" + d.opponent)
	  		      .style("stroke", "red")
		  	}

		  })
		  .on("mouseout", function(d){
		  	    d3.select("#country_list_table")
		  		  .select("." + d.opponent)
		  		  .attr("width", 26)
		  		  .attr("height", 26)
		  		d3.select("#middle_view_svg_0")
	  		      .select(".win_loss_whole_bar_" + d.date + "_" + d.name + "_" + d.opponent)
	  		      .style("display", "none")

	  		    d3.select(".win_loss_path_" + d.date + "_" + d.name + "_" + d.opponent)
	  		      .style("stroke", "none")
		  })

		console.log("team_matches_list", team_matches_list)
		d3.selectAll(".win_loss_match_g")
		  .each(function(d){
		  	// console.log(d)
		  	d3.select(this)
		  	  .selectAll("rect")
		  	  .data(d.game_info)
		  	  .enter()
		  	  .append("rect")
		  	  .attr("class", "win_loss_bar") //  + " win_loss_bar_" + d.date + "_" + d.name + "_" + d.opponent
		      .attr("x", dd=>x_scale(dd.accumalted_prob))
		      .attr("y", (dd,i)=>(matrix_height+1) * (Math.floor(i/3)))
		      .attr("height", matrix_height)
		      .attr("width",  dd=>matrix_width * dd.percent)
		      .style("fill",  dd=>color_scale[dd.win_or_loss])
		      .style("opacity", dd=>dd.is_this_result?opacity_scale(dd.result_goal):0.1)
		  })

		d3.selectAll(".win_loss_match_g")
		  .append("rect")
		  .attr("class", d=>"win_loss_whole_bar" + " win_loss_whole_bar_" + d.date + "_" + d.name + "_" + d.opponent)
		  .attr("width", matrix_width)
		  .attr("height", matrix_height)
		  .style("stroke", "red")
		  .style("stroke-width", 4)
		  .style("fill", "none")
		  .style("display", "none")
		//g_win_loss_match.selectAll("")


		// add text
		// d3.select("#middle_view_svg_0")
		//   .selectAll(".win_loss_text")
		//   .data([...Array(group_match.length).keys()])
		//   .enter()
		//   .append("text")
		//   .text((d,i)=>i)
		//   .attr("class", "win_loss_text")
		//   .style("fill", "stone")
		//   .attr("color", "stone")
		//   .style("font-size", "12px")
		//   .attr("y", (d,i)=>(matrix_height+1) * i - 6)
	})
}
