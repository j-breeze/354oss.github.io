//This tells Leaflet to connect to the tile service at the URL and display them on the map.
var map = L.map('map').setView([38, -95], 4);
var basemapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl).addTo(map);
