$( document ).ready(function() {

  // Width and height of main, map svg
  var width = 600,
      height = 350;

  var projection = d3.geoMercator();
    
  var path = d3.geoPath()
    .projection(projection)

  //svg for the map visualization
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "map-svg")
      .attr("viewBox", '0 0 600 350');

  $("body").append("<div id='tooltip'></div>");
  $("body").append("<div id='tooltip2'></div>");

  $("#map-svg").delay(50).animate({ opacity:1, transition: "1.0s" }, 50);

  //svg for legend
  var key = d3.select("#legend1")
        .append("svg")
        .attr("width", 600)
        .attr("height", 50);

  var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "15%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ADD8E6")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "15%")
        .attr("stop-color", "#FFBEB1")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FF2900")
        .attr("stop-opacity", 1);

      key.append("rect")
        .attr("id", "legend-rect")
        .attr("width", 400)
        .attr("height", 20)
        .attr("fill", "url(#gradient)")
        .attr("transform", "translate(100,10)");

      $("#legend-rect").delay(50).animate({ opacity:1, transition: "2.5s" }, 300);

      var y = d3.scaleOrdinal()
        .range([0, 110, 400])
        .domain(["0 attacks on record", "1 attack on record", "700+ attacks on record"]);

      var yAxis = d3.axisBottom()
        .scale(y)
        .ticks(3);

      key.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(100,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");

      $(".y-axis").delay(50).animate({ opacity:1, transition: "2s" }, 100);


  // Load map; do initial filling of no-attack states; handle click and mouseover functionality
  d3.json("us.json", function(error, places) {
  	if (error) console.log(error);

    	statesGroup = svg.append("g").attr("id", "map")
    					.attr("transform", "scale(3.5 3.5) translate(-132 -95)");

    	states = statesGroup
                .selectAll("path")
                .data(places.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function() { return "rgb(173,"+(216+(Math.random()*39))+", "+(230+(Math.random()*25))+")" })
                .on("click", handleClick)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .attr("opacity", ".9")
                .attr("id", function(d, i) {
                  return d.properties.NAME.replace(/\s/g, ''); //get rid of spaces in state name
                })

      // Click on state on map goes to attack page specific to that state
      function handleClick(d, i) {
        window.location = "index.php?us_state="+this.id+"/";
      }

      // Mouseover a state on map displays documented attacks for that state
      function handleMouseOver(d) {
        attack_count = attacks_per_state_dict[this.id];
        if (attack_count == undefined) {
          attack_count = 0;
        }
        state_name = this.id.replace(/([A-Z])/g, ' $1');
        d3.select("#tooltip").text(state_name);
        d3.select("#tooltip2").text("Documented Attacks: "+attack_count);
        d3.select(this).attr("opacity", ".6");
      }
      function handleMouseOut(d){
        // because vanilla JS wasn't working here...
        $("#tooltip").text("");
        $("#tooltip2").text("");
        d3.select(this).attr("opacity", ".9");
      }

      // Make Hawaii and Puerto Rico closer to rest of US
      var hawaii = d3.select("#Hawaii");
      hawaii.attr("transform", "translate(80 -20)")

      var puerto = d3.select("#PuertoRico");
      puerto.attr("transform", "translate(-20 -10)")


  });

});
