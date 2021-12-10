//The Map!
var map = L.map('map').setView([64.666, -147.101], 8);
var basemap = L.tileLayer.provider('Stamen.Terrain').addTo(map);
var circle = L.circle([64.666, -147.101], {
										 color:'blue',
										 fillColor:'#f03',
										 fillOpacity:0.35,
										 radius:500
}).addTo(map);

//Hold markers group  
//var mesoMarkersGroup=new L.LayerGroup();  

//Get weather information from Mesowest for the state
//var tkn ="7c0eab19bffc4221af1eaf73b4b1237e"
//$.getJSON('https://api.synopticdata.com/v2/stations/latest',  
//     {  
//          within:1440,
//          obtimezone:'utc',
//          units:'english'
//          stid:'PAEI',
//          latestobs:1,  
//          token:tkn
//     },   
//     function (data)   
//     {  //Loop through all the weather stations  
//       for(var i=0;i<data.STATION.length;i++)  
//          {  
//           try{  
//                var stn = data.STATION[i];  
//                //var dat = stn.OBSERVATIONS;  
//                var stnInfo = stn.NAME.toUpperCase();  
                //var elev=parseInt(stn.ELEVATION);            
                //stnInfo = "<b>Air Temp:&nbsp;</b>"+Math.round(dat.air_temp[1])+"&deg;F"+ "</br><b>Wind Speed:&nbsp;</b>"+Math.round(dat.wind_speed[1]* 1.150)+"MPH"+"</br>  
                //+<b>Wind Direction:&nbsp;</b>"+getCardinalDirection(Math.round(dat.wind_direction[1]))+"</br><b>Relative Humidity:&nbsp;</b>"+dat.relative_humidity[1]+"%"+"</br>  
                //+<b>Elevation:&nbsp;</b>"+elev+"&prime;";       
                //Add stations into Leaflet markers group  
//                L.marker(L.latLng(stn.LATITUDE,stn.LONGITUDE),{title:stn.NAME.toUpperCase()}).bindPopup(stnInfo).addTo(mesoMarkersGroup);  
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
//     alert("Could not access the MesoWest!");  
//});  
//Add markers group to the Map  
//map.addLayer(mesoMarkersGroup);  

