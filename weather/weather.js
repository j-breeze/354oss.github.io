//This tells Leaflet to connect to the tile service at the URL and display them on the map.
var map = L.map('map')

var mapcenter = L.latLng([64.6431, -147.0638]);
var zoomLevel = 8;

map.setView(mapcenter, zoomLevel);

L.control.scale({position:'topleft',imperial:false}).addTo(map)

stam = L.tileLayer.provider("Stamen.Terrain").addTo(map);
aip = L.tileLayer.provider("OpenAIP").addTo(map);

var baseMaps = {
	"OpenAIP": aip,
	"Stamen Terrain": stam
};

// MesoWest API key = 7c0eab19bffc4221af1eaf73b4b1237e

//Hold markers group  
var mesoMarkersGroup=new L.LayerGroup();   
//Get weather information from Mesowest for the state VA  
$.getJSON('http://api.mesowest.net/stations?callback=?',  
     {  
          state:'ak',                   
          latestobs:1,  
          token:'7c0eab19bffc4221af1eaf73b4b1237e'  
     },   
     function (data)   
     {  //Loop through all the weather stations  
       for(var i=0;i<data.STATION.length;i++)  
          {  
           try{  
                var stn = data.STATION[i];  
                var dat = stn.OBSERVATIONS;  
                var stnInfo =stn.NAME.toUpperCase();  
                var elev=parseInt(stn.ELEVATION);            
                stnInfo = "<b>Air Temp:&nbsp;</b>"+Math.round(dat.air_temp[1])+"&deg;F"+ "</br><b>Wind Speed:&nbsp;</b>"+Math.round(dat.wind_speed[1]* 1.150)+"MPH"+"</br>  
                +<b>Wind Direction:&nbsp;</b>"+getCardinalDirection(Math.round(dat.wind_direction[1]))+"</br><b>Relative Humidity:&nbsp;</b>"+dat.relative_humidity[1]+"%"+"</br>  
                +<b>Elevation:&nbsp;</b>"+elev+"&prime;";       
                //Add stations into Leaflet markers group  
                L.marker(L.latLng(stn.LATITUDE,stn.LONGITUDE),{title:stn.NAME.toUpperCase()}).bindPopup(stnInfo).addTo(mesoMarkersGroup);  
           }    
           catch(e)  
           {  
               alert("Error! "+ e);  
           }  
          }   
 })       
.done(function()  
{  
})  
.fail(function()  
{       
     alert("Could not access the MesoWest!");  
});  
//Add markers group to the Map  
map.addLayer(mesoMarkersGroup);  
