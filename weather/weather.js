//Synoptic/MesoWest API Token: 7c0eab19bffc4221af1eaf73b4b1237e. Only gets 5,000 accesses per month!

var map = L.map('map').setView([64.666, -147.101], 8);
var basemap = L.tileLayer.provider('Stamen.Terrain').addTo(map);

//For some reason this var method puts the coords as long/lat instead of lat/long
var moas = [{
	//R-2201B and R-2201D Fort Greely
    "type": "Feature",
    "properties": {"ect": "Cat 3"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [63.951667, -145.504167],
			[63.937222, -145.521389],
			[63.915000, -145.448611],
			[63.826667, -145.581389],
			[63.826667, -145.679167],
			[63.870556, -145.696944],
			[63.882222, -145.714444],
			[63.916944, -145.714444],
			[63.938889, -145.657222],
			[63.953056, -145.656944]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"ect": "Cat 2"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [63.979167, -145.585000],
			[63.968889, -145.584722],
			[63.951667, -145.504167],
			[63.953056, -145.656944],
			[63.980000, -145.656944]
        ]]
    }
}];

L.geoJSON(moas, {
    style: function(feature) {
        switch (feature.properties.ect) {
            case 'Cat 3': return {color: "#ff0000"};
            case 'Cat 2':   return {color: "#0000ff"};
        }
    }
}).addTo(map);


L.geoJSON(moas, {
	style: function(feature) {
		switch (feature.properties.ect) {
			case 'Cat 3': return {color: "#ff0000"};
			case 'Cat 2': return {color: "#0000ff"};
		}
	}
}).addTo(map);

				
//R-2201C Fort Greely
var polygon = L.polygon([
	[63.979167, -145.585000],
	[63.968889, -145.584722],
	[63.951667, -145.504167],
	[63.953056, -145.656944],
	[63.980000, -145.656944]], {
	color:'red',
	fillColor: '#f03',
	fillOpacity: 0.35,
	}).addTo(map);

//Yukon 1 MOA

//PAEI

//Getting the data!
//The Map! This centers the view on Eielson and makes it full-screen.
var map = L.map('map').setView([64.666, -147.101], 8);
//This is the basemap. Used a sleek terrain with minimal other info. Loads faster than pure satellite imagery.
var basemap = L.tileLayer.provider('Stamen.Terrain').addTo(map);
//This is what actually pulls the weather station data in from Syntoptic Data (who owns MesoWest). See https://developers.synopticdata.com/mesonet !
$.getJSON('https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&obtimezone=utc&output=json&units=english&status=active&varsoperator=and&state=AK&within=1440',
  {
    // request parameters for synoptic data, but can keep it blank since the parameters are in the URL above
  },
  function (data)
  {
    //This is where we do the markers. See https://leafletjs.com/examples.html
	for(var i=0;i<data.STATION.length;i++) {
		var stn = data.STATION[i];
		var obs = stn.OBSERVATIONS;
		var stnInfo = stn.NAME.toUpperCase();
		var circle = L.circle(L.latLng(stn.LATITUDE, stn.LONGITUDE), {
     			color:'black',
	   		fillColor:'#f03',
	    		fillOpacity:1.00,
	 		radius:5000
     		}).addTo(map).bindPopup("Hello");
	}
  }
);
