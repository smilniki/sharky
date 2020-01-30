<!DOCTYPE html>
  <html lang='en'>
  <head>
    <title>Sharky</title>
    <link rel='stylesheet' type='text/css' href='style.css'>
    <link rel='stylesheet' type='text/css' href='https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css'>
    <script src='https://d3js.org/d3.v4.min.js'></script>
    <script src='jquery-3.4.1.min.js'></script>
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script type='text/javascript' > 

        // Define global variables here

        var attacks_per_state_dict = {};
        var attacks_per_state_dict_0100 = {}; //used for color-mapping

        var totalAttacks = 0;

        // Filter the csv file
        filteredData = [];

        var records_for_each_state = {}; //will store list of records for each state

        // Attack scale works by mapping proportion of attacks for a state onto the range 0-100
        // and then mapping this range to colors (sqrtScale bc Florida has so many attacks)
        var sqrtScale = d3.scaleSqrt().domain([0, .56]).range([0, 100]);
        var attack_scale = d3.scaleLinear().domain([1, 100]).range(["#FFBEB1", "#FF2900"]);

      $( document ).ready(function() {

        // To retain only the columns we want; better column names
        function grabColumns(line) {
          return { 
            Activity: line["Activity"],
            Age: line["Age"],
            Area: line["Area"],
            Country: line["Country"],
            Fatal: line["Fatal (Y/N)"],
            Injury: line["Injury"],
            Location: line["Location"],
            Sex: line["Sex"],
            Species: line["Species"],
            Type: line["Type"],
            Year: line["Year"],
            Link: line["href"]
          };
        };

        d3.json("us_attacks.json", function(error, data) {
          if (error) throw error;
          //console.log(data);

          //Populate attacks_per_state_dict; keys are state names and values are number of attacks 
            for (i in data){
              if (!(data[i].Area in attacks_per_state_dict)) {
                attacks_per_state_dict[data[i].Area.replace(/\s/g, '')] = 1;
                records_for_each_state[data[i].Area.replace(/\s/g, '')] = [];
                records_for_each_state[data[i].Area.replace(/\s/g, '')].push(data[i]);
              }
              else {
                attacks_per_state_dict[data[i].Area.replace(/\s/g, '')] += 1;
                records_for_each_state[data[i].Area.replace(/\s/g, '')].push(data[i]);
              }
              totalAttacks += 1;
            }

            //console.log(attacks_per_state_dict);
            //console.log(records_for_each_state);
            

            //Populate attacks_per_state_dict_0100 dictionary values to values between 0 and 100
            for (i in attacks_per_state_dict){
              attacks_per_state_dict_0100[i] = sqrtScale(attacks_per_state_dict[i]/data.length)
              //console.log(attacks_per_state_dict[i])
            }

          fillStatesRed();

        });

        function fillStatesRed() {
          // Make all states with shark attacks be a shade of red (darker shade for states with more attacks)
          
          setTimeout(function() {
            for (i in attacks_per_state_dict_0100){
                var state = d3.select("#"+i);
                state.attr("fill", fillRed);
              }
            }, 1000);

          function fillRed() { //jquery function for fade-in filling of states
            $(this).css({fill : attack_scale(attacks_per_state_dict_0100[i]), transition: Math.floor(Math.random()*5)+"s" });
          }
        };

      });
  </script>
  </head>
  <body>
<?php

$page = $_SERVER['REQUEST_URI'];

//echo $page;
if (strpos($page, '?us_state=') == false) //Display whole U.S map visualization
  echo "<div id='sharky-title'>Sharky: A U.S. Shark Attack Visualization</div>
  <div id='desc'>Click on a state to view it's detailed shark attack information</div>
  <div id='legend1'></div>
  <script src='index_script.js'></script>
  <script type='text/javascript'>
      //Fade-in title and description on main page
      $('#sharky-title').delay(50).animate({ opacity:1, transition: '1s' }, 100);
      $('#desc').delay(50).animate({ opacity:1, transition: '1s' }, 100);
</script>";
else //Display state-specific visualizations
  echo "<div id='back'>Go back to map</div>
  <script src='state_script.js'></script>
  <div id='state-title'></div>
  <div id='state-subtitle'></div>
  <div id='state-info'></div>
  <div id='total-attacks'></div>
  <div id='fatalities'></div>
  <div id='scroll-down'>Scroll down to view data table of attacks</div>
  <div id='data-table'><div id='data-table-title'>Click on an table entry to view record on file</div></div>
  <script type='text/javascript'>
      //Fade-in title and description on main page
      $('#state-title').delay(100).animate({ opacity:1, transition: '2.0s' }, 100);
      $('#state-subtitle').delay(200).animate({ opacity:1, transition: '.5s' }, 50);
      $('#total-attacks').delay(300).animate({ opacity:1, transition: '2.0s' }, 50);
      $('#fatalities').delay(300).animate({ opacity:1, transition: '2.0s' }, 50);
</script>";

?>
<a id="data-source" href="https://www.kaggle.com/teajay/global-shark-attacks">Data Source</a>
</body>
</html>