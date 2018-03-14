// Create map object 
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
    layer.bindPopup("<h3 class='infoHeader'>Country:</h1> \
<p class='plate'>" + feature.properties.name + "</p>");
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
