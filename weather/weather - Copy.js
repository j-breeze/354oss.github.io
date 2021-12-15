//This sets the boundaries and zoom for the map. Limited it to Alaska.
var map = L.map('map', {
	maxZoom:12,
	minZoom:6,
	maxBounds:[[46.654,-200.941],[76.701,-120.231]]
}).setView([64.666, -147.101], 8);

//This is code for the tiles (the terrain map). Limited it to only load Alaska. Faster, saves data!
var basemap = L.tileLayer.provider('Stamen.Terrain', {
	bounds:[[46.654,-200.941],[76.701,-120.231]]
}).addTo(map);

//This is where the script pulls the data from Synoptic (owns MesoWest). The URL defines the parameters of what is pulled.
fetch("https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&obtimezone=utc&output=geojson&units=english&status=active&varsoperator=and&state=AK&within=1440")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {

	var jsonLayer = L.geoJSON(data)	
	jsonLayer.addTo(map);
	});
