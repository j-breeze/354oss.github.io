//This tells Leaflet to connect to the tile service at the URL and display them on the map.
var map = L.map('map').setView([38, -95], 4);
var basemapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl).addTo(map);
var OpenAIP = L.tileLayer('https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}', {
	attribution: '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
	ext: 'png',
	minZoom: 4,
	maxZoom: 14,
	tms: true,
	detectRetina: true,
	subdomains: '12'
}).addTo(map);
