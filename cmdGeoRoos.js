(function () {
	"use strict";
TODO:
VAR LOCATIE = VAR LOCATION , update_positie);

	 var settings = {
		 SANDBOX : "SANDBOX";
		 LINEAIR : "LINEAIR";
		 GPS_AVAILABLE : 'GPS_AVAILABLE';
		 GPS_UNAVAILABLE : 'GPS_UNAVAILABLE';
		 POSITION_UPDATED : 'POSITION_UPDATED';
		 REFRESH_RATE : 1000;
		 currentPosition : currentPositionMarker : customDebugging : debugId : map : interval :intervalCounter : updateMap : false;
		 locatieRij : markerRij : [];
	}

	function EventTarget(){this._listeners={}}
	EventTarget.prototype={constructor:EventTarget,addListener:function(a,c){"undefined"==typeof this._listeners[a]&&(this._listeners[a]=[]);this._listeners[a].push(c)},fire:function(a){"string"==typeof a&&(a={type:a});a.target||(a.target=this);if(!a.type)throw Error("Event object missing 'type' property.");if(this._listeners[a.type]instanceof Array)for(var c=this._listeners[a.type],b=0,d=c.length;b<d;b++)c[b].call(this,a)},removeListener:function(a,c){if(this._listeners[a]instanceof Array)for(var b=
	this._listeners[a],d=0,e=b.length;d<e;d++)if(b[d]===c){b.splice(d,1);break}}}; 
	var ET = new EventTarget();

	var geo = {
		init: function () {
			debug_message("Controleer of GPS beschikbaar is...");

	        ET.addListener(settings.GPS_AVAILABLE, _start_interval);
	        ET.addListener(settings.GPS_UNAVAILABLE, function(){debug_message('GPS is niet beschikbaar.')});

	        (geo_position_js.init())?ET.fire(settings.GPS_AVAILABLE):ET.fire(settings.GPS_UNAVAILABLE);
		},
		startInterval: function (event) {
			debug_message("GPS is beschikbaar, vraag positie.");
		    _update_position();
		    settings.interval = self.setInterval(_update_position, REFRESH_RATE);
		    ET.addListener(settings.POSITION_UPDATED, _check_locations);
		},
		updatePosition: function () {
			settings.intervalCounter++;
	    	geo_position_js.getCurrentPosition(_set_position, _geo_error_handler, {enableHighAccuracy:true});
		},
		setPosition: function (position) {
			settings.currentPosition = position;
		    ET.fire("settings.POSITION_UPDATED");
		    debug_message(settings.intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
		},
		checkLocations: function (event) {
		    // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
		    for (var i = 0; i < locations.length; i++) {
		        var location = {coords:{latitude: locations[i][3],longitude: locations[i][4]}};

		        if(_calculate_distance(location, settings.currentPosition)<locations[i][2]){

		            // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
		            if(window.location!=locations[i][1] && localStorage[locations[i][0]]=="false"){
		                // Probeer local storage, als die bestaat incrementeer de locatie
		                try {
		                    (localStorage[locations[i][0]]=="false")?localStorage[locations[i][0]]=1:localStorage[locations[i][0]]++;
		                } catch(error) {
		                    debug_message("Localstorage kan niet aangesproken worden: "+error);
		                }

		// TODO: Animeer de betreffende marker

		                window.location = locations[i][1];
		                debug_message("Speler is binnen een straal van "+ locations[i][2] +" meter van "+locations[i][0]);
		            }
		        }
		    }
		}
	}
	var methods = {
		calculateDistance: function (p1, p2){
			var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
			var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
			return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
		}, 
		isNumber: function (n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		}

	}
	var maps = {
		/**
		* generate_map(myOptions, canvasId)
		*  roept op basis van meegegeven opties de google maps API aan
		*  om een kaart te genereren en plaatst deze in het HTML element
		*  wat aangeduid wordt door het meegegeven id.
		*
		*  @param myOptions:object - een object met in te stellen opties
		*      voor de aanroep van de google maps API, kijk voor een over-
		*      zicht van mogelijke opties op http://
		*  @param canvasID:string - het id van het HTML element waar de
		*      kaart in ge-rendered moet worden, <div> of <canvas>
		*/

		generateMap: function (myOptions, canvasId) {
			// TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
		    debug_message("Genereer een Google Maps kaart en toon deze in #"+canvasId)
		    settings.map = new google.maps.Map(document.getElementById(canvasId), myOptions);

		    var routeList = [];
		    // Voeg de markers toe aan de map afhankelijk van het tourtype
		    debug_message("locations intekenen, tourtype is: "+tourType);
		    for (var i = 0; i < locations.length; i++) {

		        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locations toe
		        try {
		            (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locations[i][0]]=false:null;
		        } catch (error) {
		            debug_message("Localstorage kan niet aangesproken worden: "+error);
		        }

		        var markerLatLng = new google.maps.LatLng(locations[i][3], locations[i][4]);
		        routeList.push(markerLatLng);

		        settings.markerRij[i] = {};
		        for (var attr in locationMarker) {
		            settings.markerRij[i][attr] = locationMarker[attr];
		        }
		        settings.markerRij[i].scale = locations[i][2]/3;

		        var marker = new google.maps.Marker({
		            position: markerLatLng,
		            map: settings.map,
		            icon: settings.markerRij[i],
		            title: locations[i][0]
		        });
		    }
		// TODO: Kleur aanpassen op het huidige punt van de tour
		    if(tourType == settings.LINEAIR){
		        // Trek lijnen tussen de punten
		        debug_message("Route intekenen");
		        var route = new google.maps.Polyline({
		            clickable: false,
		            map: settings.map,
		            path: routeList,
		            strokeColor: 'Black',
		            strokeOpacity: .6,
		            strokeWeight: 3
		        });

		    }

		    // Voeg de locatie van de persoon door
		    settings.currentPositionMarker = new google.maps.Marker({
		        position: kaartOpties.center,
		        map: settings.map,
		        icon: positieMarker,
		        title: 'U bevindt zich hier'
		    });

		    // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
		    ET.addListener(settings.POSITION_UPDATED, update_positie);
		}

		updatePosition: function (event) {
			var newPos = new google.maps.LatLng(settings.currentPosition.coords.latitude, currentPosition.coords.longitude);
		    settings.map.setCenter(newPos);
		    settings.currentPositionMarker.setPosition(newPos);
		}
	}
	var debug = {
		geoErrorHandler : function (code, message) {
			debug_message('geo.js error '+code+': '+message);
		}
		debugMessage : function(message){
		    (settings.customDebugging && settings.debugId)?document.getElementById(settings.debugId).innerHTML:console.log(message);
		}
		setCustomDebugging: function(debugId){
		    debugId = this.debugId;
		    settings.customDebugging = true;
		}

	}

})