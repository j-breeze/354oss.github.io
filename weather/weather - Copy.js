// https://leafletjs.com/reference.html for how everything works with Leaflet!
// https://developers.synopticdata.com/mesonet/v2/ for how the MesoWest/Synoptic API grabs data!

//This is code for the tiles that make up the background map. I limited it to only load tiles within lat/long bounds of Alaska. 
//Faster, saves data! :)
//Uses Stamen layers for the background (see leaflet-providers.js for more background layer options). Only using Terrain and Toner for now. 
//Some others are CONUS-only and others like watercolor don't always load well. But you can get all sorts of background map layers online!

var terrain = L.tileLayer.provider('Stamen.Terrain', {
	bounds:[[50,-200.941],[74,-127.231]]
});

var toner = L.tileLayer.provider('Stamen.Toner', {
	bounds:[[50,-200.941],[74,-127.231]]
});

//Sets markers into a layer so we can toggle them on and off later.

const newObsGroup = L.layerGroup();
const oldObsGroup = L.layerGroup();

//This sets the boundaries and zoom for the map. Limited it to Alaska.
//maxZoom sets how far you can zoom in. minZoom sets how far you can zoom out!
//minZoom helps limit view to Alaska. maxZoom helps prevent super high res images from loading, 
//and super zoomed in terrain often doesn't load correctly anyway. (404 errors, doubt the database has images!)
//maxBounds will pull the user back to the map if they try to scroll outside the set Lat/Longs.
//layers tells Leaflet which map layers to toggle 'on' by default on page load. Layer names are further down in code.

var map = L.map('map', {
	maxZoom:12,
	minZoom:5,
	maxBounds:[[46.654,-200.941],[76,-120.231]],
	layers: [terrain, newObsGroup]
}).setView([64.666, -147.101], 8);

//This is where the script pulls the data from Synoptic (parent company of MesoWest). The URL defines the parameters of what is pulled.
//Typical format is &[parameter]=[thing]. For instance, &units=metric sets the returned unit values to metric.
//https://developers.synopticdata.com/mesonet/explorer/ lets you customize what the API delivers and gives you a custom URL automatically!
//This link only allows 5,000 accesses per month for free, may need subscription? If data is not pulling, paste URL into web browser to see 
//if appears. The "token" is linked to my Synoptic account (jresenbeck) and unique. Needed to access data. 
//If it breaks at any point, make your own account and get your own token.

//Current settings:

//Obs: Most recent ob from that sensor only
//Time Format: "HH:MM:SSZ / DD-Mmm-YYYY" (see https://pubs.opengroup.org/onlinepubs/007908799/xsh/strftime.html)
//Time Zone: UTC/Zulu
//API Output: geojson
//Units: English/American Customary
//Status: Active sensors only
//State: Alaska (pulls all sensors in AK, can replace state with county, or other ranges)
//Within: 1440 minutes (only pulls obs less than 24hrs old)

L.realtime({
	url: 'https://api.synopticdata.com/v2/stations/latest?&token=7c0eab19bffc4221af1eaf73b4b1237e&timeformat=%TZ%n/%n%d-%b-%Y&obtimezone=utc&output=geojson&units=english&status=active&varsoperator=and&state=AK&within=1440',
	crossOrigin: true,
	type: 'geojson',
}, {
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
		
		//The below code changes what the icons look like based on settings in leaflet.css and then slaps the ECT in text on top.
		//Modify leaflet.css 'divIcons' section to change colors, shape, sizing, ect. 

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
		
		//The below overall flags obs more than an hour old.
		//This part grabs obs times and splits them up into an array for year, month, hours, ect.
		//For instance, splits 18:15:00Z\n\/\n02-Apr-2023 into ['13:30:00Z', '02-Apr-2023'], then further still.
		//What's in .split() determines what character is being used to separate strings.

		const obtimes = feature.properties.date_time;
		const splitdate = obtimes.split("\n/\n");
		const timeParts = splitdate[0].split(":");
		const dateParts = splitdate[1].split("-");
		const year = dateParts[2];
		const monthAbbrev = dateParts[1];
		const day = dateParts[0];
		const hours = timeParts[0];
		const minutes = timeParts[1];
		const seconds = timeParts[2].replace("Z", "");

		//The below converts the month names (Mmm) from strings into numbers, which we'll need to do math.
		//For instance, Jan = 0, Feb = 1, Mar = 2, and so on.

		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = monthNames.indexOf(monthAbbrev);

		//Javascript stores all dates/times in 'number of milliseconds since 0000Z, Jan 1 1970' so we  convert
		//our date/time into milliseconds since New Years 1970, then subtract our date from the current date/time in milliseconds. 
		//If the time is less than 3,600,000 millisonds in difference (1 hour) then we show the ob.

		const date = new Date(year, month, day, hours, minutes, seconds);
		const dateInMilliseconds = date.getTime();
		const currentTime = new Date().getTime();
		const differenceInMilliseconds = currentTime - dateInMilliseconds;
		if (differenceInMilliseconds < 3600000) {

			//The below code is what adds the markers to the map, and binds a popup on click with some information.

			const newObs = L.marker(latlng, {icon: tempIcon}).bindPopup("<h3>"+"Station: "+feature.properties.stid+"</h3>"+"🕐	Ob Time: "+feature.properties.date_time+"<br>"+"⛰️	Elevation: "+feature.properties.elevation+" ft"+"<br>"+"🌡	Air Temp: "+Math.round(feature.properties.air_temp)+"°F"+"<br>"+" 💨	Wind Speed: "+Math.round(feature.properties.wind_speed)+" kts");

			newObsGroup.addLayer(newObs);

		} else {
			const oldObs = L.marker(latlng, {icon: tempIcon}).bindPopup("<h3>"+"Station: "+feature.properties.stid+"</h3>"+"🕐	Ob Time: "+feature.properties.date_time+"<br>"+"⛰️	Elevation: "+feature.properties.elevation+" ft"+"<br>"+"🌡	Air Temp: "+Math.round(feature.properties.air_temp)+"°F"+"<br>"+" 💨	Wind Speed: "+Math.round(feature.properties.wind_speed)+" kts");

			oldObsGroup.addLayer(oldObs);

		};

    }
});

//The below defines the layers we can toggle on and off. By default, terrain and obs < 1hr old are turned on.
//If you want to change the defaults, go back up to L.map near the top and add the later names set down here.

const baseMaps = {
	'Terrain': terrain,
	'Toner': toner,
};

const obMarkers ={
	'Obs < 1hr Old': newObsGroup,
	'Obs > 1hr Old': oldObsGroup,
};

L.control.layers(null, baseMaps).addTo(map);
L.control.layers(null, obMarkers).addTo(map);

//The below pulls the MOAs and styles them with red borders with no fill-in! Downloaded from the FAA ArcGIS page 
//as a .geoJSON file: https://adds-faa.opendata.arcgis.com/ 
//The MOAs probably will not appear if you simply open 'index.html' in a web browser, as web browsers block fetch
//requests from multiple origins. Because the html is not hosted on a web server, is has no origin, and thus blocks
//anything with an origin. As a result, it will only show on GitHub or other internet hosted webpages.
//You probably could use the FAA's APIs to get around this, but then you have to register, get approved,
//and they change the links all the time... It's all rather gross. If MOAs get updated, though, you'll
//need to go re-download a new geojson from the link above and replace it.

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