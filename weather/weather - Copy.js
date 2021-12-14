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
		stnINFO = obs.air_temp[1];
		var circle = L.circle(L.latLng(stn.LATITUDE, stn.LONGITUDE), {
     			color:'black',
	   		fillColor:'#f03',
	    		fillOpacity:1.00,
	 		radius:5000
     		}).addTo(map).bindPopup(stnInfo);
	}
  }
);

//     {  //Loop through all the weather stations  
//       for(var i=0;i<data.STATION.length;i++)  
//          {  
//           try{  
//                var stn = data.STATION[i];  
//                var dat = stn.OBSERVATIONS;  
//                var stnInfo = stn.NAME.toUpperCase();  
//                var elev=parseInt(stn.ELEVATION);            
//                stnInfo = "<b>Air Temp:&nbsp;</b>"+Math.round(dat.air_temp[1])+"&deg;F"+ "</br><b>Wind Speed:&nbsp;</b>"+Math.round(dat.wind_speed[1]* 1.150)+"MPH"+"</br>  
//                +<b>Wind Direction:&nbsp;</b>"+getCardinalDirection(Math.round(dat.wind_direction[1]))+"</br><b>Relative Humidity:&nbsp;</b>"+dat.relative_humidity[1]+"%"+"</br>  
//                +<b>Elevation:&nbsp;</b>"+elev+"&prime;";       
//                //Add stations into Leaflet markers group  
//                L.marker(L.latLng(stn.LATITUDE,stn.LONGITUDE),{title:stn.NAME.toUpperCase()}).bindPopup(stnInfo).addTo(MarkerGroup);  
//           }    
//           catch(e)  
//           {  
//               alert("Error! "+ e);  
//           }  
//     }   
//})       
//.done(function()  
//{  
//})  
//.fail(function()  
//{       
//     alert("!");  
//});  
//Add markers group to the Map  
//map.addLayer(MarkerGroup);  

