// Create map object and specify zoom, center, min/max zoom, and max bounds
var map = L.map("map", {
    center: [20, 40],
    zoom: 2,
    minZoom: 2,
    maxZoom: 10,
    maxBounds: [
        // Set the maximum boundry to the south west
        [-84, 180],
        // Set the maximum boundry to the north east
        [84, -180]
        ], 
});

// add api key to variable 
var apiKey = "access_token=pk.eyJ1IjoiYWJmZGF0YSIsImEiOiJjamU2aHlrZTgwMGdxMzNxa3R3OG5wZmNkIn0._No3joCSQ0ZhN2KE30LC8w";

// Add default layer - Dark Map layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey).addTo(map);

// Outdoors - default map
//var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + apiKey, 
//{id: 'map'});

// Satellite map
//var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
//{id: 'map'});

// Dark map - default map
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + apiKey,
{id: 'map'});

// dark.addTo(map);

var baseMaps = {
//    "Outdoors": outdoors,
//    "Satellite": satellite,
    "Dark": dark
};

// earthquakes all week data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// L.control({position: 'bottomleft'});

var controlLayers = L.control.layers(baseMaps).addTo(map);

// Create the country borders

borderslink = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";        

// Grabbing our GeoJSON data..
d3.json(borderslink, function(data) {
  var bordersLayer = L.geoJson(data, {
    onEachFeature: borderInfo,
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    }
    }).addTo(map);
    controlLayers.addOverlay(bordersLayer, 'Country Borders');
});

var data = [{
	values: [1.05, 78.9, 20],
	labels: ['Agriculture', 'Services', 'Industry'],
	marker: {
		colors: ["#6dd159","#515fa5","#e5817b"]
	},
	type: 'pie',
    textfont: {
        family: 'Arial',
        size: 14,
        color: 'rgb(255, 255, 255)'
    }
}];

var layout = {
	legend:{
		x:20,
		y:0,
		font:{
			family: "Arial",
			size: 14,
			color:'rgb(255, 255, 255)'
		}
	},
	annotations:[
    {
    xref: 'paper',
    yref: 'paper',
    x: 0.05,
    y: 1.0,
    xanchor: 'left',
    yanchor: 'bottom',
  	text: 'United States of America GDP Composition',
    font:{
        family: 'Arial',
        size: 16,
        color: 'rgb(255, 255, 255)'
    },
    showarrow: false
    }
  ],
  	hovermode: false,
  	autosize: false,
	width: 500,
	height: 300,
	paper_bgcolor: '#1a1a1a',
	plot_bgcolor: '#1a1a1a',
	margin: {
    l: 50,
    r: 50,
    b: 10,
    t: 50,
    pad: 1
  }
};
// build the pie chart and insert into index.html
Plotly.newPlot('pie-chart', data, layout,{displayModeBar: false});

var trace1 = {
	name: "United States",
	x: [2015, 2016, 2017],
	y: [5.3, 4.9, 4.9],
	type: 'scatter',
	marker: {
		color: 'rgb(12, 206, 18)',
		size: 12,
		line: {
			color: '#fff',
			width: 1
			}
		}
};

var trace2 = {
	name: "Global Avg",
    x: [2015, 2016, 2017],
    y: [9.5,9.3,9.2],
    type: 'scatter',
    marker: {
		color: '#15b3db',
		size: 12,
		line: {
			color: '#fff',
			width: 0.5
				}
    	}
  };

var data = [trace1, trace2];

var layout = {
	title: "United States of America Unemployment Rate Change",
    font:{
          family: 'Arial',
          size: 12,
          color: 'rgb(255, 255, 255)'
    },
	paper_bgcolor: '#1a1a1a',
	plot_bgcolor: '#1a1a1a',
	width: 500,
	height: 300,
	hovermode: false,
  xaxis: {
  	autotick: false,
	ticks: 'outside',
    showgrid: true,
    showline: true,
    gridcolor: '#bdbdbd',
    gridwidth: 1,
    linecolor: '#bdbdbd',
    tickfont: {
      family: 'Arial',
      size: 14,
      color: '#bdbdbd'
    }
  },
  yaxis: {
    showgrid: true,
    showline: true,
    gridcolor: '#bdbdbd',
    gridwidth: 1,
    linecolor: '#bdbdbd',
    tickfont: {
      family: 'Arial',
      size: 14,
      color: '#bdbdbd'
    }
  }
};
// build the line chart and insert into index.html
Plotly.newPlot('line-chart', data, layout,{displayModeBar: false});

function borderInfo(feature, layer) {
    layer.on({
      click: function(event) {
          map.fitBounds(event.target.getBounds());
          // Pass the country code over to a function
          var pieChart = createPieChart(event.target.feature);
          var lineChart = createLineChart(event.target.feature);
          Plotly.purge('pie-chart');
          Plotly.newPlot('pie-chart', pieChart[0], pieChart[1],{displayModeBar: false});
          Plotly.purge('line-chart');
          Plotly.newPlot('line-chart', lineChart[0], lineChart[1],{displayModeBar: false});
        }
      });
    layer.bindPopup("<p class='plate'>" + feature.properties.name + "</p>");
}

function getRandomPie(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createPieChart(country) {
  var countryId = country.id;
  var countryName = country.properties.name;
  //var data;
  //var layout;
  var pieMainLayout = [];
  var valuesPoints = [getRandomPie(33),getRandomPie(33),getRandomPie(33)];
  
  function valuesData(country) {
  d3.json(`/metadata/${countryId}`, function(error, countryData){
	var ag = 0;
  	var ser = 0;
  	var ind = 0;
    ag += countryData.agriculture2015;
    ser += countryData.services2015;
    ind += countryData.industry2015;
    valuesPoints.push(ag);
	valuesPoints.push(ser);
	valuesPoints.push(ind);
  });
	return(valuesPoints);
  }
  //console.log("Values: "+ valuesData());
	var data_update = [{
		//values: valuesData(),
		values: valuesPoints,
		labels: ['Agriculture', 'Services', 'Industry'],
		marker: {
		colors: ["#6dd159","#515fa5","#e5817b"]
			},
		type: 'pie',
		textfont: {
			family: 'Arial',
			size: 14,
			color: 'rgb(255, 255, 255)'
			}
		}];
	var layout_update = {
		annotations:[
		    {
		    xref: 'paper',
		    yref: 'paper',
		    x: 0.05,
		    y: 1.0,
    		xanchor: 'left',
    		yanchor: 'bottom',
		  	text: `${countryName} of America GDP Composition`,
		    font:{
		        family: 'Arial',
		        size: 16,
		        color: 'rgb(255, 255, 255)'
		    },
		    showarrow: false
		    }
		],
		font:{
		    family: "Arial",
		    size: 12,
		    color:'rgb(255, 255, 255)'
		  },
		legend:{
		  x:20,
		  y:0,
		  font:{
		    family: "Arial",
		    size: 14,
		    color:'rgb(255, 255, 255)'
		  }
		},
		autosize: false,
		width: 500,
		height: 300,
		paper_bgcolor: '#1a1a1a',
		plot_bgcolor: '#1a1a1a',
		margin: {
		  l: 50,
		  r: 50,
		  b: 10,
		  t: 50,
		  pad: 1
		},
		hovermode: false
	};
	pieMainLayout.push(data_update);
	pieMainLayout.push(layout_update);
	return(pieMainLayout);
}

// since we cannot get the unemployment variables to pass through the below function. We are just going to use dummy data. Using random number generator

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createLineChart(country) {
    var countryId = country.id;
  	var countryName = country.properties.name;
  	//var data;
  	//var layout;
  	var lineMainLayout = [];
  	var unemploymentPoints = [getRandomInt(5),getRandomInt(5),getRandomInt(5)];
  	
  	function unemploymentData(country) {
		d3.json(`/metadata/${countryId}`, function(error, countryData){
			var unemploymentPoints = [];
			var unemp2015 = 0;
			var unemp2016 = 0;
			var unemp2017 = 0;
			unemp2015 += countryData.Unemployment2015;
			unemp2016 += countryData.Unemployment2016;
			unemp2017 += countryData.Unemployment2017;
			unemp2015 = [unemp2015];
			unemp2016 = [unemp2016];
			unemp2017 = [unemp2017];
			unemploymentPoints.push(unemp2015);
			console.log("unemploymentPoints1: " + unemploymentPoints);
			unemploymentPoints.push(unemp2016);
			console.log("unemploymentPoints2: " + unemploymentPoints);
			unemploymentPoints.push(unemp2017);
			console.log("unemploymentPoints3: " + unemploymentPoints);
			Plotly.restyle('line-chart','y', [unemploymentPoints]);
		});
	//console.log("unemploymentPoints4: " + unemploymentPoints);
	//console.log("#####: " + unemp2017);
	return(unemploymentPoints);
	}

	var trace1 = {
		name: `${countryName}`,
	    x: [2015, 2016, 2017],
	    y: unemploymentPoints,
	    //y: [5.3,4.3,5.2],
	    type: 'scatter',
	    marker: {
	      color: '#ed7a49',
	      size: 12,
	      line: {
	        color: '#fff',
	        width: 0.5
	      }
	    }
  };
  console.log("unemploymentPoints4: " + unemploymentPoints);
  //console.log(trace1);
	var trace2 = {
		name: "Global Avg",
	    x: [2015, 2016, 2017],
	    y: [9.5,9.3,9.2],
	    type: 'scatter',
	    marker: {
	      color: '#15b3db',
	      size: 12,
	      line: {
	        color: '#fff',
	        width: 0.5
	      }
	    }
  };

  var data = [trace1, trace2];

  var layout = {
    title: `${countryName} Unemployment Change`,
    font:{
          family: 'Arial',
          size: 12,
          color: 'rgb(255, 255, 255)'
    },
    paper_bgcolor: '#1a1a1a',
    plot_bgcolor: '#1a1a1a',
    width: 500,
	height: 300,
	hovermode: false,
    xaxis: {
    	autotick: false,
    	ticks: 'outside',
		showgrid: true,
		showline: true,
		gridcolor: '#bdbdbd',
		gridwidth: 2,
		linecolor: '#bdbdbd',
		tickfont: {
			family: 'Arial',
			size: 14,
			color: '#bdbdbd'
			}
		},
    yaxis: {
      showgrid: true,
      showline: true,
      gridcolor: '#bdbdbd',
      gridwidth: 2,
      linecolor: '#bdbdbd',
      tickfont: {
        family: 'Arial',
        size: 14,
        color: '#bdbdbd'
      }
    },
    legend:{
		x:20,
		y:0,
		font:{
			family: "Arial",
			size: 14,
			color:'rgb(255, 255, 255)'
		}
	},
  };
  lineMainLayout.push(data);
  lineMainLayout.push(layout);
  return(lineMainLayout);
}

// // CHOROPLETH SECTION

// var choro;

// // create var to read gini data
// var giniData = d3.json("/gini", function(err, data) {
//   if (err) throw err;
  
//   console.log(data);

// });

// // Grabbing data with d3...
// d3.json(borderslink, function(data) {

//   // Creating a new choropleth layer
//   choro = L.choropleth(data, {
//     // Which property in the features to use
//     valueProperty: "name",
//     // Color scale
//     scale: ["#ffffb2", "#b10026"],
//     // Number of breaks in step range
//     steps: 10,
//     // q for quantile, e for equidistant, k for k-means
//     mode: "q",
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },
//     // Binding a pop-up to each layer
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("<p class='plate'>" + feature.properties.name + "</p>");
//     }
//   }).addTo(map);
  
//   // add controlLayers for Choropleth
//   controlLayers.addOverlay(choro, 'Gini')

//   // style 

//   function getColor(giniData) {
//     return giniData > 90 ? '#800026' :
//       giniData > 80 ? '#BD0026' :
//         giniData > 70 ? '#E31A1C' :
//           giniData > 50 ? '#FC4E2A' :
//             giniData > 30 ? '#FD8D3C' :
//               giniData > 10 ? '#FEB24C' :
//                 giniData > 0 ? '#FED976' :
//                   '#FFEDA0';
//   }

//   function style() {
//     return {
//         fillColor: getColor(giniData),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         fillOpacity: 0.7
//     };
// }

// L.geoJson(data, {style: style}).addTo(map);



//   // Setting up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = choro.options.limits;
//     var colors = choro.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h3>Gini Coefficient</h3>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(map);

// });

// // END CHOROPLETH SECTION

// Setting up the legend
//var legend = L.control({position: 'bottomleft'});
//legend.onAdd = function (map) {
//
//    var div = L.DomUtil.create('div', 'info legend'),
//        grades = [0, 1, 2, 3, 4, 5],
//        labels = [];
//
//    // loop through our density intervals and generate a label with a colored square for each interval
//    for (var i = 0; i < grades.length; i++) {
//        div.innerHTML +=
//            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//    }
//
//    return div;
//};

//legend.addTo(map);

//});
