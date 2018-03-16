// Create map object 
var map = L.map("map", {
    center: [20, 40],
    zoom: 2,
    minZoom: 2,
    maxZoom: 10,
    maxBounds: [
        //south west
        [-84, 180],
        //north east
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

// var plates_link = "../json/plates.json"

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

// CHOROPLETH SECTION

var geojson;

var choroLink = "https://raw.githubusercontent.com/ABFdata/Homework/master/geoJSON/borderGini.json"

// Grabbing data with d3...
d3.json(choroLink, function(data) {

  // Creating a new choropleth layer
  geojson = L.choropleth(data, {
    // Which property in the features to use
    valueProperty: "GiniCoefficient",
    // Color scale
    scale: ["#ffffb2", "#b10026"],
    // Number of breaks in step range
    steps: 10,
    // q for quantile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.CountryName + "<br> Gini Coefficient:<br>" + feature.properties.GiniCoefficient);
    }
  }).addTo(map);
  
  // add controlLayers for Choropleth
  controlLayers.addOverlay(geojson, 'Gini')

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



  // Setting up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h3>Gini Coefficient</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);

});




// END CHOROPLETH SECTION




function borderInfo(feature, layer) {
    layer.on({
      click: function(event) {
          map.fitBounds(event.target.getBounds());
          // Pass the country code over to a function
          //console.log(event.target.feature.id)
          console.log(event.target.feature);
          var pieChart = createPieChart(event.target.feature);
          var lineChart = createLineChart(event.target.feature);
          Plotly.newPlot('pie-chart', pieChart[0], pieChart[1]);
          Plotly.newPlot('line-chart', lineChart[0], lineChart[1]);
        }
      });
    layer.bindPopup("<p class='plate'>" + feature.properties.name + "</p>");
}

function createPieChart(country) {
  var countryId = country.id;
  var countryName = country.properties.name;
  var pieMainLayout = [];
  console.log(countryName);
  console.log(countryId);
  var data = [{
  values: [19, 26, 55],
  labels: ['Residential', 'Non-Residential', 'Utility'],
  type: 'pie',
    textfont: {
        family: 'Arial',
        size: 14,
        color: 'rgb(255, 255, 255)'
    }
  }];

  var layout = {
    title: `${countryName} GDP Compositon`,
    font:{
        family: "Arial",
        size: 14,
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
    width: 400,
    height: 300,
    paper_bgcolor: '#1a1a1a',
    plot_bgcolor: '#1a1a1a',
    margin: {
      l: 50,
      r: 50,
      b: 10,
      t: 10,
      pad: 1
    }
  };
  pieMainLayout.push(data);
  pieMainLayout.push(layout);
  return(pieMainLayout);
}

function createLineChart(country) {
    var countryId = country.id;
    var countryName = country.properties.name;
    var lineMainLayout = [];
    var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'scatter',
    marker: {
      color: 'rgb(12, 206, 18)',
      size: 12,
      line: {
        color: '#fff',
        width: 0.5
      }
    }
  };

  var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter',
    marker: {
      color: 'rgb(229, 73, 76)',
      size: 12,
      line: {
        color: '#fff',
        width: 0.5
      }
    }
  };

  var data = [trace1, trace2];

  var layout = {
    title: `${countryName} Population Change`,
    font:{
          family: 'Arial',
          size: 16,
          color: 'rgb(255, 255, 255)'
    },
    paper_bgcolor: '#1a1a1a',
    plot_bgcolor: '#1a1a1a',
    xaxis: {
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
        family: 'Arials',
        size: 14,
        color: '#bdbdbd'
      }
    }
  };
  lineMainLayout.push(data);
  lineMainLayout.push(layout);
  return(lineMainLayout);
}

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
