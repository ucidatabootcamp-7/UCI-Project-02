// SVG Canvas
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var link = "/metadata";

// Create SVG wrapper
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append SVG group
var chart = svg.append("g");

// Append a div to the body to create tooltips and assign it a class
d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Retrieve data from the json file
d3.json("/metadata", function(err, worldData) {
  if (err) throw err;
  
  console.log(worldData);

  worldData.forEach(function(data) {
    data.HDI = +data.HDI;
    data.GDP_PPP = +data.GDP_PPP;
    data.LifeExpectancy = +data.LifeExpectancy;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // store the minimum and maximum values in a column from csv
  var xMin;
  var xMax;
  var yMax;

  // This function identifies the minimum and maximum values to define axises
  function findMinAndMax(dataColumnY) {
    yMin = d3.min(worldData, function(data) {
      return +data[dataColumnY] * 0.8;
    });

    yMax = d3.max(worldData, function(data) {
      return +data[dataColumnY] * 1.1;
    });

    xMax = d3.max(worldData, function(data) {
      return +data.GDP_PPP * 1.1;
    });
  }

  // Default y-axis is 'HDI'
  var currentAxisLabelY = "HDI";

  // Call findMinAndMax() with 'HDI' as default
  findMinAndMax(currentAxisLabelY);

  // Set the domain of an axis to extend from the min to the max value
  yLinearScale.domain([yMin, yMax]);
  xLinearScale.domain([0, xMax]);

  // Initialize tooltip
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    
    .html(function(data) {
      var CountryName = data.CountryName;
      var gdpPPP = +data.GDP_PPP;
      var worldInfo = +data[currentAxisLabelY];
      var world_dev_info;
      // Tooltip text depends on which axis is active/has been clicked
      if (currentAxisLabelY === "HDI") {
        world_dev_info = "Human Development Indicator: ";
      }
      else {  
        world_dev_info = "Life Expectancy: ";
      }
      return CountryName +
        "<br>" +
        world_dev_info +
        worldInfo +
        "<br>World Dev Data gdpPPP: " +
        gdpPPP;
    });

  // Create tooltip
  chart.call(toolTip);

  chart
    .selectAll("circle")
    .data(worldData)
    .enter()
    .append("circle")
    .attr("cy", function(data, index) {
      return xLinearScale(data.GDP_PPP);
    })
    .attr("cx", function(data, index) {
      return yLinearScale(+data[currentAxisLabelY]);
    })
    .attr("r", "5")
    .attr("fill", "#1a7916")
    // display tooltip on click
    .on("click", function(data) {
      toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Append an SVG group for the x-axis, then display the x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis")
    .call(bottomAxis);

  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append x-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "GDP_PPP")
    .text("gdpPPP for each Country");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    
    .attr("class", "axis-text active")
    .attr("data-axis-name", "HDI")
    .text("gdpPPP plotted vs HDI");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
    
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "LifeExpectancy")
    .text("gdpPPP plotted vs Life Expectancy");

  // change between two x-axis options
  function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
  }

  d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
    var clickedSelection = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("current axis: ", clickedAxis);
if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelX = clickedAxis;
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax(currentAxisLabelX);
      // Set the domain for the x-axis
      xLinearScale.domain([xMin, xMax]);
      // Create a transition effect for the x-axis
      svg
        .select(".x-axis")
        .transition()
        .duration(2000)
        .call(bottomAxis);

      d3.selectAll("circle").each(function() {
        d3
          .select(this)
          .transition()
          .attr("cx", function(data) {
            return xLinearScale(+data[currentAxisLabelX]);
          })
          .duration(2000);
      });

      // Change the status of the axes
      labelChange(clickedSelection);
    }
  });
});