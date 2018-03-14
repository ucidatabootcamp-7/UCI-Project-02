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

// end of js closing braces
});