//This sets the boundaries and zoom for the map. Limited it to Alaska.
var map = L.map('map', {
	//maxZoom sets how far you can zoom in. minZoom sets how far you can zoom out!
	//minZoom helps limit view to Alaska. maxZoom helps prevent super high res images from loading, 
	//and super zoomed in terrain often doesn't load correctly anyway. (404 errors, doubt they have images!)
	maxZoom:10,
	minZoom:5,
	//This will pull the user back to the map if they try to scroll outside these Lat/Longs
	maxBounds:[[46.654,-200.941],[76.701,-120.231]]
}).setView([64.666, -147.101], 8);

//This is code for the tiles (the terrain map). Limited it to only load Alaska. Faster, saves data! :)
var basemap = L.tileLayer.provider('Stamen.Terrain', {
	bounds:[[46.654,-200.941],[76.701,-120.231]]
}).addTo(map);

//This is where the script pulls the data from Synoptic (parent company of MesoWest). The URL defines the parameters of what is pulled.
//Typical format is &[parameter]=[thing]. For instance, &units=metric sets the returned unit values to metric.
//https://developers.synopticdata.com/mesonet/explorer/ lets you customize what the API delivers and gives you a custom URL automatically!
fetch("https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&obtimezone=utc&output=geojson&units=english&status=active&varsoperator=and&state=AK&within=1440&units=english")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		var jsonLayer = L.geoJSON(data, {
			//This shows the data in the popup bubbles on the station icons when clicked. Has ECT equation built in.
			onEachFeature: function (feature, jsonLayer) {
				jsonLayer.bindPopup("<h3>"+"Station: "+feature.properties.stid+"</h3>"+"ECT: "+Math.round(35.74+(0.6215*feature.properties.air_temp)-(35.75*(feature.properties.wind_speed**0.16))+(0.4275*feature.properties.air_temp*((feature.properties.wind_speed/1.15077944802)**0.16)))+"°F"+"<br>"+"Air Temp: "+Math.round(feature.properties.air_temp)+"°F"+"<br>"+"Wind Speed: "+feature.properties.wind_speed+" kts");
			}	
		}).addTo(map);
	});
	
//This pulls the MOAs! Downloaded from the FAA ArcGIS page as a .geoJSON file: https://adds-faa.opendata.arcgis.com/ 
fetch('Special_Use_Airspace.geojson')
	.then(function(response2) {
			return response2.json();
	})
	.then(function moaStyle(data2) {
		return {
			fillcolor:'blue',
			weight:2,
			opacity:1,
			color:'#0000FF',
			fillOpacity:0.33
		}
	}).addTo(map);