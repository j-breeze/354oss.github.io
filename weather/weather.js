// https://leafletjs.com/reference.html for how everything works!

//This is code for the tiles that make up the background map. Limited it to only load tiles in Alaska. Faster, saves data! :)
//Uses Stamen layers (see leaflet-providers.js for more layers). Only using Terrain and Toner for now. 
//Some others are CONUS-only and others like watercolor don't always load well.
var terrain = L.tileLayer.provider('Stamen.Terrain', {
	bounds:[[50,-200.941],[74,-127.231]]
});

var toner = L.tileLayer.provider('Stamen.Toner', {
	bounds:[[50,-200.941],[74,-127.231]]
});

//This sets the boundaries and zoom for the map. Limited it to Alaska.
//maxZoom sets how far you can zoom in. minZoom sets how far you can zoom out!
//minZoom helps limit view to Alaska. maxZoom helps prevent super high res images from loading, 
//and super zoomed in terrain often doesn't load correctly anyway. (404 errors, doubt the databse has images!)
//Maxbounds will pull the user back to the map if they try to scroll outside these Lat/Longs
var map = L.map('map', {
	maxZoom:12,
	minZoom:5,
	maxBounds:[[46.654,-200.941],[76,-120.231]],
	layers: [terrain]
}).setView([64.666, -147.101], 8);

//This is code for the layers and their names. Allows choosing in top right menu.
var baseLayers = {
	'Terrain': terrain,
	'Toner': toner,
};

var layerControl = L.control.layers(baseLayers).addTo(map);

//This is where the script pulls the data from Synoptic (parent company of MesoWest). The URL defines the parameters of what is pulled.
//Typical format is &[parameter]=[thing]. For instance, &units=metric sets the returned unit values to metric.
//https://developers.synopticdata.com/mesonet/explorer/ lets you customize what the API delivers and gives you a custom URL automatically!
//This link only allows 5,000 accesses per month for free, may need subscription? If data is not pulling, paste URL into web browser to see if appears.
//The "token" is linked to my Synoptic account (jresenbeck) and unique. Needed to access data.
fetch("https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&obtimezone=utc&output=geojson&units=english&status=active&varsoperator=and&state=AK&within=1440&units=english")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		L.geoJSON(data, {
			//This tells the function what to set the text labels and popups to, according to wind chill formula.
			pointToLayer: function (feature, latlng) {
				if (feature.properties.air_temp == null && feature.properties.wind_speed == null) {
					var ECT = "Bad"
				} else if (feature.properties.air_temp == null || feature.properties.wind_speed == null) {
					var ECT = "NaN"
				} else if (feature.properties.wind_speed >= 2.60693) {	
					var ECT = Math.round(35.74+(0.6215*feature.properties.air_temp)-(35.75*(feature.properties.wind_speed**0.16))+(0.4275*feature.properties.air_temp*((feature.properties.wind_speed/1.15077944802)**0.16)));
				} else {
					var ECT = Math.round(feature.properties.air_temp);
				};
				
				if (ECT == "Bad") {
					var tempIcon = L.divIcon({
						className: 'temp-icon-missing',
						html: ECT,
						iconSize: 0,
				})} else if (ECT == "NaN") {
					var tempIcon = L.divIcon({
						className: 'temp-icon-warning',
						html: "⚠️",
						iconSize: 30,
				})} else if (ECT > 0) {
					var tempIcon = L.divIcon({
						className: 'temp-icon-green',
						html: ECT+"°F",
						iconSize: 30,
				})} else if (ECT > -30) {
					var tempIcon = L.divIcon({
						className: 'temp-icon-yellow',
						html: ECT+"°F",
						iconSize: 30,
				})} else {
					var tempIcon = L.divIcon({
						className: 'temp-icon-red',
						html: ECT+"°F",
						iconSize: 30,
				})};
				
				return L.marker(latlng, {icon: tempIcon}).bindPopup("<h3>"+"Station: "+feature.properties.stid+"</h3>"+"🌡Air Temp: "+Math.round(feature.properties.air_temp)+"°F"+"<br>"+"💨Wind Speed: "+Math.round(feature.properties.wind_speed)+" kts").addTo(map);
			}
		}).addTo(map);
	})

//This pulls the MOAs and styles them with red borders with no fill-in! Downloaded from the FAA ArcGIS page 
//as a .geoJSON file: https://adds-faa.opendata.arcgis.com/ 
fetch("Special_Use_Airspace.geojson")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		L.geoJSON(data, {
			style: {
				color: "red",
				fillOpacity:0
			},
			onEachFeature: function (feature, moaLayer) {
				moaLayer.bindPopup("<h3>"+feature.properties.NAME+"</h3>");
			}
		}).addTo(map);
	});