//This sets the boundaries and zoom for the map. Limited it to Alaska.
var map = L.map('map', {
	//maxZoom sets how far you can zoom in. minZoom sets how far you can zoom out!
	//minZoom helps limit view to Alaska. maxZoom helps prevent super high res images from loading, 
	//and super zoomed in terrain often doesn't load correctly anyway. (404 errors, doubt they have images!)
	maxZoom:12,
	minZoom:5,
	//This will pull the user back to the map if they try to scroll outside these Lat/Longs
	maxBounds:[[46.654,-200.941],[76.701,-120.231]]
}).setView([64.666, -147.101], 8);

//This is code for the tiles (the terrain map). Limited it to only load Alaska. Faster, saves data! :)
var basemap = L.tileLayer.provider('Stamen.Terrain', {
	bounds:[[46.654,-200.941],[76.701,-120.231]]
}).addTo(map);

//This sets the marker options for the stations!
var stnMarkerWg = {
	radius:10,
	fillColor:"purple",
	color:"black",
	opacity:1,
	fillOpacity:1
};

var stnMarkerOG = {
	radius:10,
	fillColor:"red",
	color:"black",
	opacity:1,
	fillOpacity:1
};

var stnMarkerBad = {
	radius:10,
	fillColor:"yellow",
	color:"black",
	opacity:1,
	fillOpacity:1
};

var stnMarkerGood = {
	radius:10,
	fillColor:"green",
	color:"black",
	opacity:1,
	fillOpacity:1
};

var stnMarkerUkn = {
	radius:10,
	fillColor:"black",
	color:"black",
	opacity:1,
	fillOpacity:1
};

let stnMarkerOptions;

//This is where the script pulls the data from Synoptic (parent company of MesoWest). The URL defines the parameters of what is pulled.
//Typical format is &[parameter]=[thing]. For instance, &units=metric sets the returned unit values to metric.
//https://developers.synopticdata.com/mesonet/explorer/ lets you customize what the API delivers and gives you a custom URL automatically!
fetch("https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&obtimezone=utc&output=geojson&units=english&status=active&varsoperator=and&state=AK&within=1440&units=english")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		var jsonLayer = L.geoJSON(data, {
			//This loops through each feature and applies a popup with ECT information if wind > 2.6 kts 
			//The equation doesnt work below that wind speed!
			onEachFeature: function (feature, jsonLayer) {
				if (feature.properties.air_temp == null) {
					var uECT = "Unknown!";
				} else if (feature.properties.wind_speed == null ) {
					var uECT = "Unknown!";
				} else if (feature.properties.wind_speed >= 2.60693) {	
					var uECT = Math.round(35.74+(0.6215*feature.properties.air_temp)-(35.75*(feature.properties.wind_speed**0.16))+(0.4275*feature.properties.air_temp*((feature.properties.wind_speed/1.15077944802)**0.16)))+"°F";
				} else {
					var uECT = feature.properties.air_temp+"°F";
				};
				
				if (feature.properties.wind_speed == null) {
					var windspeed = "Unknown!";
				} else {
					var windspeed = Math.round(feature.properties.wind_speed)+" kts";
				};
				
				if (feature.properties.air_temp == null) {
					var airtemp = "Unknown!";
				} else {
					var airtemp = Math.round(feature.properties.air_temp)+"°F";
				};
				
				jsonLayer.bindPopup("<h3>"+"Station: "+feature.properties.stid+"</h3>"+"ECT: "+uECT+"<br>"+"Air Temp: "+airtemp+"<br>"+"Wind Speed: "+windspeed);
				
				// This sets the coloring based on the ECT.
				switch (true) {
					case (uECT <= -50):
						var stnMarkerOptions = stnMarkerWg;
						break;
					case (uECT <= -30):
						var stnMarkerOptions = stnMarkerOG;
						break;
					case (uECT <= 0):
						var stnMarkerOptions = stnMarkerBad;
						break;
					case (uECT > 0):
						var stnMarkerOptions = stnMarkerGood;
						break;
					default:
						var stnMarkerOptions = stnMarkerUkn
						break;
				};
			},
			//This tells the function to use the station marker options defined above.
			pointToLayer: function (feature2, latlng) {
				return L.circleMarker(latlng, stnMarkerOptions);	
			}
		}).addTo(map);
	});

//This defines the settings for the MOAs.
var moaMarkerOptions = {
	color:"red",
	fillColor:"red",
	fillOpacity:0
};

//This pulls the MOAs! Downloaded from the FAA ArcGIS page as a .geoJSON file: https://adds-faa.opendata.arcgis.com/ 
fetch("Special_Use_Airspace.geojson")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		var moaLayer = L.geoJSON(data, {
			onEachFeature: function (feature, moaLayer) {
				moaLayer.bindPopup("<h3>"+feature.properties.NAME+"</h3>");
			}
		}).addTo(map);
	});
	

	