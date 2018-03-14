// Set intial values for map and plots
// Select default country by IsoCode - USA
// Select default country by CountryName - United States of America

// START OF LEAFLET
// This section loads the leaflet map by pulling data from our api endpoint /borders
d3.json("/borders", function(error, data){
    if(error)return console.warn(error);
    console.log(data)

    var map = L.map("map", {
        center: [20, 40],
        zoom: 2
    
    });
    
    // add api key to variable 
    var apiKey = "access_token=pk.eyJ1IjoiYWJmZGF0YSIsImEiOiJjamU2aHlrZTgwMGdxMzNxa3R3OG5wZmNkIn0._No3joCSQ0ZhN2KE30LC8w";
    
    // Add default layer - Dark Map layer
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey).addTo(map);
    
    // Outdoors - default map
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + apiKey, 
    {id: 'map'});
    
    // Satellite map
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
    {id: 'map'});
    
    // Dark map - default map
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
    {id: 'map'});
    
    // dark.addTo(map);
    
    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Dark": dark
    };

    var controlLayers = L.control.layers(baseMaps).addTo(map);

    var bordersLayer = L.geoJson(data, {
        onEachFeature: borderInfo,
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
        }).addTo(map);
        controlLayers.addOverlay(bordersLayer, 'Country Borders');
    
    
    
    function borderInfo(feature, layer) {
        layer.bindPopup("<h3 class='infoHeader'>Country:</h1> \
    <p class='plate'>" + feature.properties.name + "</p>");
    }
// END OF LEAFLET




// SCATTERPLOT 
// this section creates the catter plot by pulling from our api endpoint /d3scatterplotdata
// var svgWidth = 960;
// var svgHeight = 500;

// var margin = { top: 20, right: 40, bottom: 80, left: 100 };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // var link = "/d3scatterplotdata";
// //console.log(link);
// // Create SVG wrapper
// var svg = d3
//   .select(".scatterplot")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Append SVG group
// var chart = svg.append("g");

// // Append a div to the body to create tooltips and assign it a class
// d3.select(".scatterplot")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// // Retrieve data from the CSV file
// d3.json("/d3scatterplotdata", function(err, worldDevData) {
//   if (err) throw err;

//   // script to ignore null values
// //   var validatedInput = function(worldDevData) {
// //       return worldDevData.filter(function(data){
// //           return +data.HDI != null;
// //       });
// //   };
    
//   worldDevData.forEach(function(data) {
//     data.HDI = +data.HDI;
//     data.GDP_PPP = +data.GDP_PPP;
//     data.LifeExpectancy = +data.LifeExpectancy;
//   });

//   // Create scale functions
//   var yLinearScale = d3.scaleLinear().range([height, 0]);

//   var xLinearScale = d3.scaleLinear().range([0, width]);

//   // Create axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // store the minimum and maximum values in a column from csv
//   var xMin;
//   var xMax;
//   var yMax;

//   // This function identifies the minimum and maximum values to define axises
//   function findMinAndMax(dataColumnX) {
//     xMin = d3.min(worldDevData, function(data) {
//       return +data[dataColumnX] * 0.8;
//     });

//     xMax = d3.max(worldDevData, function(data) {
//       return +data[dataColumnX] * 1.1;
//     });

//     yMax = d3.max(worldDevData, function(data) {
//       return +data.GDP_PPP * 1.1;
//     });
//   }

//   // Default x-axis is 'HDI'
//   var currentAxisLabelX = "HDI";

//   // Call findMinAndMax() with 'HDI' as default
//   findMinAndMax(currentAxisLabelX);

//   // Set the domain of an axis to extend from the min to the max value
//   xLinearScale.domain([xMin, xMax]);
//   yLinearScale.domain([0, yMax]);

//   // Initialize tooltip
//   var toolTip = d3
//     .tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
    
//     .html(function(data) {
//       var CountryName = data.CountryName;
//       var GDP_PPP = +data.GDP_PPP;
//       var worldDataInfo = +data[currentAxisLabelX];
//       var worldDevInfo;
//       // Tooltip text depends on which axis is active/has been clicked
//       if (currentAxisLabelX === "HDI") {
//         worldDevInfo = "Human Development Index: ";
//       }
//       else {  
//         worldDevInfo = "Life Expectancy: ";
//       }
//       return CountryName +
//         "<br>" +
//         worldDevInfo +
//         worldDataInfo +
//         "<br>Country GDP_PPP: " +
//         GDP_PPP;
//     });

//   // Create tooltip
//   chart.call(toolTip);

//   chart
//     .selectAll("circle")
//     .data(worldDevData)
//     .enter()
//     .append("circle")
//     .attr("cx", function(data, index) {
//       return xLinearScale(+data[currentAxisLabelX]);
//     })
//     .attr("cy", function(data, index) {
//       return yLinearScale(data.GDP_PPP);
//     })
//     .attr("r", "10")
//     .attr("fill", "#1a7916")
//     // display tooltip on click
//     .on("click", function(data) {
//       toolTip.show(data);
//     })
//     // hide tooltip on mouseout
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   // Append an SVG group for the x-axis, then display the x-axis
//   chart
//     .append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .attr("class", "x-axis")
//     .call(bottomAxis);

//   // Append a group for y-axis, then display it
//   chart.append("g").call(leftAxis);

//   // Append y-axis label
//   chart
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left + 40)
//     .attr("x", 0 - height / 2)
//     .attr("dy", "1em")
//     .attr("class", "axis-text")
//     .attr("data-axis-name", "GDP_PPP")
//     .text("GDP_PPP for each Country");

//   // Append x-axis labels
//   chart
//     .append("text")
//     .attr(
//       "transform",
//       "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
//     )
    
//     .attr("class", "axis-text active")
//     .attr("data-axis-name", "HDI")
//     .text("GDP_PPP with HDI");

//   chart
//     .append("text")
//     .attr(
//       "transform",
//       "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
//     )
    
//     .attr("class", "axis-text inactive")
//     .attr("data-axis-name", "LifeExpectancy")
//     .text("GDP_PPP with Life Expectancy");

//   // change between two x-axis options
//   function labelChange(clickedAxis) {
//     d3
//       .selectAll(".axis-text")
//       .filter(".active")
//       .classed("active", false)
//       .classed("inactive", true);

//     clickedAxis.classed("inactive", false).classed("active", true);
//   }

//   d3.selectAll(".axis-text").on("click", function() {
//     // Assign a variable to current axis
//     var clickedSelection = d3.select(this);
//     // "true" or "false" based on whether the axis is currently selected
//     var isClickedSelectionInactive = clickedSelection.classed("inactive");
//     var clickedAxis = clickedSelection.attr("data-axis-name");
//     console.log("current axis: ", clickedAxis);
// if (isClickedSelectionInactive) {
//       // Assign the clicked axis to the variable currentAxisLabelX
//       currentAxisLabelX = clickedAxis;
//       // Call findMinAndMax() to define the min and max domain values.
//       findMinAndMax(currentAxisLabelX);
//       // Set the domain for the x-axis
//       xLinearScale.domain([xMin, xMax]);
//       // Create a transition effect for the x-axis
//       svg
//         .select(".x-axis")
//         .transition()
//         .duration(2000)
//         .call(bottomAxis);

//       d3.selectAll("circle").each(function() {
//         d3
//           .select(this)
//           .transition()
//           .attr("cx", function(data) {
//             return xLinearScale(+data[currentAxisLabelX]);
//           })
//           .duration(2000);
//       });

//       // Change the status of the axes
//       labelChange(clickedSelection);
//     }
//   });
// });
// END OF SCATTERPLOT

// START OF BAR PLOT
d3.json("/gini", function(error, data){
    if(error)return console.warn(error);
    console.log(data)

    // data = data.slice(1, 10);

    // Trace 1 for Gini Data
    var trace1 = {
        x: data.map(row => row.GiniCoefficient),
        y: data.map(row => row.CountryName),
        text: data.map(row => row.CountryName),
        name: "Gini",
        type: "bar",
        orientation: "h"
    };

    var data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
        title: "Gini Coefficient per Country",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }

    };

    
    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("bar", data, layout);

});
// END OF BAR PLOT









// end of js closing braces
});