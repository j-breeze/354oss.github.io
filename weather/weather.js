//This tells Leaflet to connect to the tile service at the URL and display them on the map.
var map = L.map('map').setView([38, -95], 4);
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap = L.tileLayer(basemapUrl).addTo(map);
