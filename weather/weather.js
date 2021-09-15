//This tells Leaflet to connect to the tile service at the URL and display them on the map.
var map = L.map('map')

var mapcenter = L.latLng([64.6431, -147.0638]);
var zoomLevel = 13;

map.setView(mapcenter, zoomLevel);

L.control.scale({position:'topleft',imperial:false}).addTo(map)

stam = L.tileLayer.provider("Stamen.Terrain").addTo(map);
aip = L.tileLayer.provider("OpenAIP").addTo(map);

var baseMaps = {
	"OpenAIP": aip,
	"Stamen Terrain": stam
};

// MesoWest API key = 7c0eab19bffc4221af1eaf73b4b1237e
