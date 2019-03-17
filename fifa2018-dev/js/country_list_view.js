var country_list_ns = {
	clicked_countries: [],
	tr_height: 26, //24,
	tr_height_full: 140
}

function init_country_list_view() {
	d3.csv("data/country_name.csv",(error, country_names)=>{
		console.log("country_names", country_names)
		// console.log(error)
		country_name_trs = d3.select("#country_list_table")
	      .selectAll("g")
	      .data(country_names)
	      .enter()
	      .append("g")
	      .attr("class", d => "country-tr-" + d.name)
	      .attr("height", country_list_ns.tr_height)
	      .attr("transform", (d,i)=>"translate(0," + ((country_list_ns.tr_height+1)*i) + ")")
	    country_name_trs
	      .append("image")
	      .attr("class", d=>"country_name_table_img " + d.name)
	      .attr("href", d => "/img/" + encodeURI(d.name) + ".png")
	      .attr("height", country_list_ns.tr_height)
	      .attr("width", country_list_ns.tr_height)
	      .attr("x", 60)
	    country_name_trs
	      .append("text")
	      .attr("class", "coutry_name_table_text")
	      .attr("x", 0)
	      .attr("y", country_list_ns.tr_height * 0.6)
	      .text(d=>d.name)
	    country_name_trs.on("click", d=>hello_hello(d.name))
	    country_name_trs
	    	.on("mouseover", d=>{console.log(d.name); d3.select(".country-tr-" + d.name).attr("height", country_list_ns.tr_height_full)})
	    	.on("mouseout", d=>{console.log("bye"); d3.select(".country-tr-" + d.name).attr("height", country_list_ns.tr_height)})

	})
}



function click_country_list_view() {

}
