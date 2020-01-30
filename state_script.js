$( document ).ready(function() {

	back_button = d3.select("#back");
	back_button.on("click", handleBackClick);

	// Button to go back to main, map page
	function handleBackClick(d, i) {
	    window.location = "index.php";
	}

	setTimeout(function() {
		state = window.location.href.split("index.php?us_state=")[1];
		state = state.split("/")[0];
		state_w_space = state.replace(/([A-Z])/g, ' $1').substring(1,);

		$("#state-title").text(state_w_space);
		$("#state-title").css({color: 
				function() {
				if (state in attacks_per_state_dict_0100) { 
					return attack_scale(attacks_per_state_dict_0100[state]);
				} else {
					return "rgb(173, 216, 230)";
				}
			}
			});
			

		if (state in records_for_each_state ) { //state has attacks
			d3.select("#state-subtitle").text("Hover over elements to learn more")
			loadData(records_for_each_state[state]);
			$('#scroll-down').delay(300).animate({ opacity:1, transition: '3.0s' }, 50);
		} else { //state has no attacks
			d3.select("#state-subtitle").text("No documented shark attacks for this state")
		}

	}, 1000);


	// Loads in data, populates data objects and plots pie charts and other page elements including table
	function loadData(state_data) {
		var genderData = {}; // will contain attacks for each gender
		var ageData = {}; // will contain attacks for each age group
		var activityData = {}; // will contain attacks for each listed activity
		var totalAttacks = 0;
		var fatalAttacks = 0;

		// populate dictionaries above for state
		for (i in state_data) {

			// keep track of fatal attacks in this state
			totalAttacks += 1;
			if (state_data[i].Fatal == "Y") {
				fatalAttacks += 1;
			}

			// populate gender data for state; ignore entries missing gender info
			if ((!("Male" in genderData)) && (state_data[i].Sex == "M" )) {
				genderData["Male"] = 1;
			} else if ((!("Female" in genderData)) && (state_data[i].Sex == "F" )){
				genderData["Female"] = 1;
			} else {
				if (state_data[i].Sex == "M") {
					genderData["Male"] += 1;
				} else {
					genderData["Female"] += 1;
				}
			}

			// populate age data for state; only add age data if it is strictly numerical
			if (/^\d+$/.test(state_data[i].Age)) {
				if (state_data[i].Age < 12) {
					if (!("under 12 years old" in ageData)) {
						ageData["under 12 years old"] = 1;
					} else {
						ageData["under 12 years old"] += 1;
					}
				} else if (state_data[i].Age >= 12 && state_data[i].Age <= 17) {
					if (!("aged 12-17 years old" in ageData)) {
						ageData["aged 12-17 years old"] = 1;
					} else {
						ageData["aged 12-17 years old"] += 1;
					}
				} else if (state_data[i].Age >= 18 && state_data[i].Age <= 24) {
					if (!("aged 18-24 years old" in ageData)) {
						ageData["aged 18-24 years old"] = 1;
					} else {
						ageData["aged 18-24 years old"] += 1;
					}
				} else if (state_data[i].Age >= 25 && state_data[i].Age <= 34) {
					if (!("aged 25-34 years old" in ageData)) {
						ageData["aged 25-34 years old"] = 1;
					} else {
						ageData["aged 25-34 years old"] += 1;
					}
				} else if (state_data[i].Age >= 35 && state_data[i].Age <= 44) {
					if (!("aged 35-44 years old" in ageData)) {
						ageData["aged 35-44 years old"] = 1;
					} else {
						ageData["aged 35-44 years old"] += 1;
					}
				} else if (state_data[i].Age >= 45 && state_data[i].Age <= 54) {
					if (!("aged 45-54 years old" in ageData)) {
						ageData["aged 45-54 years old"] = 1;
					} else {
						ageData["aged 45-54 years old"] += 1;
					}
				} else {
					if (!("aged 55 or more years old" in ageData)) {
						ageData["aged 55 or more years old"] = 1;
					} else {
						ageData["aged 55 or more years old"] += 1;
					}
				}
			}

			if (state_data[i].Activity.includes("Surfing")) {
				state_data[i].Activity = "Surfing";
			}

			// populate activity data for state
			if (!(state_data[i].Activity in activityData) && !(state_data[i].Activity == "NA")) {
				activityData[state_data[i].Activity] = 1;
			} else {
				if (!(state_data[i].Activity == "NA")) {
					activityData[state_data[i].Activity] += 1;
				}
			}

			// convert activityData dictionary to an array
			var activityArray = Object.keys(activityData).map(function(key) {
	  			return [key, activityData[key]];
			});

			// sort the array
			var sortedActivityArray = activityArray.sort((a, b) => b[1] - a[1]);

			// retain only (up to) 7 activities
			var sortedActivityArray = sortedActivityArray.slice(0,7);

			// convert back to dictionary object
			var activityData = {};
			sortedActivityArray.forEach(function(data){
			    activityData[data[0]] = data[1];
			});

		}

		$("#total-attacks").text("Total shark attacks on record: "+totalAttacks);
		$("#fatalities").text("Percent of attacks that were fatal: "+((fatalAttacks/totalAttacks)*100).toFixed(2)+"%");

		// Define all variable inputs for gender pie chart 

		var gender_color_scale = d3.scaleOrdinal()
	  	.domain(["Male", "Female"])
	  	.range(["rgb(173, 216, 230)", "#FFBEB1"]);

	  	var genderTextScale = d3.scaleOrdinal()
	  	.domain(["Male", "Female"])
	  	.range(["Male victims: ", "Female victims: "]);

	  	var genderID = "gender-svg";
	  	var genderDelay = 50;
	  	var genderTransition = "1.0s"; // hahahahaha 
	  	var genderTitle = "Attack breakdown by gender";
	    var genderIDfunction = function(d){ return d.data.key };

	    // plot gender pie chart for this state
		plot_pie_data(genderData, genderID, genderDelay, genderTransition, gender_color_scale, genderTitle, genderIDfunction, genderTextScale);


		// Define all variable inputs for age pie chart 

		var age_color_scale = d3.scaleOrdinal()
	  	.domain(["under 12 years old", "aged 12-17 years old", "aged 18-24 years old", "aged 25-34 years old", "aged 35-44 years old", "aged 45-54 years old", "aged 55 or more years old"])
	  	.range(["#ff6666", "#fab75f", "#ffff1a", "#80ff80", "#add8e6", "#6666ff", "#ea62ea"]);

	  	var ageTextScale = d3.scaleOrdinal()
	  	.domain(["under 12 years old", "aged 12-17 years old", "aged 18-24 years old", "aged 25-34 years old", "aged 35-44 years old", "aged 45-54 years old", "aged 55 or more years old"])
	  	.range(["Victims under 12 years old: ", "Victims aged 12-17 years old: ", "Victims aged 25-34 years old: ", "Victims aged 35-44 years old: ", "Victims aged 45-54 years old: ", "Victims aged 55+ years old: "]);

	  	var ageID = "age-svg";
	  	var ageDelay = 200;
	  	var ageTransition = "1.5s"; 
	  	var ageTitle = "Attack breakdown by age";
	    var ageIDfunction = function(d){ return( d.data.key.replace(/\s/g, '_') ) }

	    // plot age pie chart for this state
		plot_pie_data(ageData, ageID, ageDelay, ageTransition, age_color_scale, ageTitle, ageIDfunction, ageTextScale);

		// Define all variable inputs for activity pie chart 

		var activity_color_scale = d3.scaleOrdinal()
	  	.domain(Object.keys(activityData))
	  	.range(["#ff6666", "#fab75f", "#ffff1a", "#80ff80", "#add8e6", "#6666ff", "#ea62ea"]);

	  	var activityTextScale = d3.scaleOrdinal()
	  	.domain(Object.keys(activityData))
	  	.range((Object.keys(activityData)).map(x => "Attacks while "+x+": "));

	  	var activityID = "activity-svg";
	  	var activityDelay = 250;
	  	var activityTransition = "2.0s";
	  	var activityTitle = "Top Activities to be Attacked";
	    var activityIDfunction = function(d){ return( d.data.key.replace(/\s/g, '_') ) }

	    // plot activity pie chart for this state
		plot_pie_data(activityData, activityID, activityDelay, activityTransition, activity_color_scale, activityTitle, activityIDfunction, activityTextScale);


		// Plot the table of data
		$( window ).one("scroll", function() {
			$("#scroll-down").delay(100).animate({ opacity:0, transition: '1.0s' }, 200);
			$("#data-table-title").delay(100).animate({ opacity:1, transition: '1.0s' }, 200);
			$("#data-table").delay(100).animate({ opacity:1, transition: '1.0s' }, 200);
			$("#data-table").append(buildTable(state_data));
			$('#mytable').DataTable();

			// Redirects rows of data table to appropriate URLs
			$('#mytable').on( 'click', 'tbody tr', function () {
				window.open($(this).data('href'), '_blank');
			} );

		});

	}


	/* Function generates and plots a pie chart from data (is a dictionary)
		id_name = id of the generated svg
		mydelay = jQuery delay for svg to be displayed on page
		mytransition = jQuery transition time (in s) for svg to be displayed on page
		mycolorscale = corresponding d3 color scale used to plot data in pie chart
		mytitle = title text displayed above pie chart
		id_return = a function specifying how to name id attributes for each pie chart section 
			(function input is a key in the data dictionary and output is how to name the id for this)
		mytextscale = a d3 scale mapping portions of the pie chart (by id) to text displayed on hover
	*/
	function plot_pie_data(data, id_name, mydelay, mytransition, mycolorscale, mytitle, id_return, mytextscale) {
		var width = 300
		var height = 300
		var margin = 70

		// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
		var radius = Math.min(width, height) / 2 - margin

		var svg = d3.select("#state-info")
		  .append("svg")
		  	.attr("id", id_name)
		  	.attr("class", "pie-svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		$("#"+id_name).delay(mydelay).animate({ opacity:1, transition: mytransition }, 200);

		 // Compute the position of each group on the pie:
		var pie = d3.pie()
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(data))

		svg.append("text")           
	        .attr("y", -90)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "12px")  
	        .text(mytitle);

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		svg
		  .selectAll('whatever')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('d', d3.arc()
		    .innerRadius(0)
		    .outerRadius(radius)
		  )
		  .attr('fill', function(d){ return(mycolorscale(d.data.key)) })
		  .attr("stroke", "white")
		  .attr("id", id_return)
		  .on("mouseover", function() { // On hover, display annotation about this portion of pie chart
		  	$(this).css({opacity: .5}), 
		  	$("#"+id_name+"-annotation").text(mytextscale(this.id.replace(/_/g, " "))+data[this.id.replace(/_/g, " ")])})
		  .on("mouseout", function() {
		  	$(this).css({opacity: .9}),
		  	$("#"+id_name+"-annotation").text("")})
		  .style("stroke-width", "2px")
		  .style("opacity", 0.9)

		 svg.append("text").attr("y", 100)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "12px")  
	        .attr("id", id_name+"-annotation"); 
	}

	// Takes in shark attack data and builds html table from it
	function buildTable(data) {
		output = "";
		output += '<table id="mytable" class="display" style="width:100%">';
		output += '<thead><tr><td>Year</td><td>Age</td><td>Sex</td><td>Type</td><td>Activity</td>'
		output += '<td>Location</td><td>Injury</td><td>Fatal</td><td>Species</td></tr></thead>';
		output += '<tbody>';

		for (var i=0; i<data.length; i++) {
			output += '<tr class="clickable-row" data-href="'+data[i].Link+'">';
			output += '<td>'+data[i].Year+'</td><td>'+data[i].Age+'</td><td>';
			output += data[i].Sex+'</td><td>'+data[i].Type+'</td><td>';
			output += data[i].Activity+'</td><td>'+data[i].Location+'</td><td>';
			output += data[i].Injury+'</td><td>'+data[i].Fatal+'</td><td>';
			output += data[i].Species+'</td></tr></a>';
		}
		output += '</tbody></table>';
		return output
	}

});

