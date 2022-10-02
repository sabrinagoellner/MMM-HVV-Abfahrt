/*
by Sabrina Göllner
@nayemi
 */

Module.register("MMM-HVV-Abfahrt", {
	// define variables used by module, but not in config data
	some_variable:  true,
	some_other_variable: "a string",

	// holder for config info from module_name.js
	config:null,

	// anything here in defaults will be added to the config data
	// and replaced if the same thing is provided in config
	defaults: {
        header: "Abfahrten",
		message: "lade Abfahrten...", // loading message
		initialLoadDelay: 2000, // load delay on start
		animationSpeed: 5000, // how fast the animation should be displayed
		updateInterval: 10000, // x milliseconds when new data is fetched
		maxDepartures: 10, // how much departures should be loaded
		direction: 6, // which direction the train or bus is taking , 6 is backwards and 1 for forwwards (see geofox documentation)
		timePeriod: 30, // time period for the departures requested
		showIcons: true, // show hvv icons or text 
		stationName: "Rauhes Haus", // station Name for displaying
		useRealtime: true,
		//url: "https://gti.geofox.de/gti/public/departureList"
	},

	init: function(){
		Log.log(this.name + " is in init!");
	},

	start: function(){
		Log.log(this.name + " is starting!");
		this.DEPARTURES = [];
        this.url = this.url;
		this.direction = this.config.direction ? this.config.direction : this.direction;
		this.timePeriod = this.config.timePeriod ? this.config.timePeriod : this.timePeriod;
		this.maxDepartures = this.config.maxDepartures ? this.config.maxDepartures : this.maxDepartures;
		this.stationName = this.config.stationName ? this.config.stationName : this.stationName;

		//console.log("maxdepartures before SEND"+ this.maxDepartures);
		//console.log("timePeriod before SEND"+ this.timePeriod);
		
        this.scheduleUpdate();   

    },

	loaded: function(callback) {
		Log.log(this.name + " is loaded!");
		callback();
	},

	// return list of other functional scripts to use, if any (like require in node_helper)
	getScripts: function() {
	return	[
			// sample of list of files to specify here, if no files,do not use this routine, or return empty list

			//'script.js', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
			//'moment.js', // this file is available in the vendor folder, so it doesn't need to be available in the module folder.
			//this.file('anotherfile.js'), // this file will be loaded straight from the module folder.
			//'https://code.jquery.com/jquery-2.2.3.min.js',  // this file will be loaded from the jquery servers.
		]
	}, 

	// return list of stylesheet files to use if any
	getStyles: function() {
		return 	[
			// sample of list of files to specify here, if no files, do not use this routine, , or return empty list

			//'script.css', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
			//'font-awesome.css', // this file is available in the vendor folder, so it doesn't need to be avialable in the module folder.
			//this.file('anotherfile.css'), // this file will be loaded straight from the module folder.
			//'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',  // this file will be loaded from the bootstrapcdn servers.
		]
	},

	// return list of translation files to use, if any
	/*getTranslations: function() {
		return {
			// sample of list of files to specify here, if no files, do not use this routine, , or return empty list

			// en: "translations/en.json",  (folders and filenames in your module folder)
			// de: "translations/de.json"
		}
	}, */ 



	// only called if the module header was configured in module config in config.js
	getHeader: function() {
		return this.config.header;
	},


    // this tells module when to update
    scheduleUpdate: function() { 
        
        setInterval(() => {
            this.getDepartures();
        }, this.config.updateInterval);
        this.getDepartures(this.config.initialLoadDelay);
        var self = this;
    },

    // this asks node_helper for data
    getDepartures: function() {         
		//var url = String(this.url);
		
		var timePeriod = this.timePeriod;
		var maxDepartures = this.maxDepartures;
		var stationName = this.stationName;
		
		console.log("stationName is: "+ stationName);
		payload = [timePeriod, maxDepartures, stationName]

        this.sendSocketNotification('GET_DEPARTURES',payload);
    },


    socketNotificationReceived: function(notification, payload) { 
        if (notification === "GET_RESULT") {
			// getting the payload back and parse it to get JSON
			this.DEPARTURES = JSON.parse(payload);
            this.updateDom(1000);
        }
        
    },


	// system notification your module is being hidden
	// typically you would stop doing UI updates (getDom/updateDom) if the module is hidden
	suspend: function(){

	},

	// system notification your module is being unhidden/shown
	// typically you would resume doing UI updates (getDom/updateDom) if the module is shown
	resume: function(){

	},

	// this is the major worker of the module, it provides the displayable content for this module
	getDom: function() {

		console.log("depts" +this.DEPARTURES.departures);
			
		var wrapper = document.createElement("div");
		wrapper.id ="HVV";
		
		if(!this.DEPARTURES.departures){
			console.log(this.name + ":no data from Server!")
			
			// if no data is there, show the loading message
			wrapper.innerHTML = this.config.message;
		} else {

			var depts = this.DEPARTURES;
		
			var table = document.createElement("table")
			table.className = "hvv-table"
			
			// Table header:
			var th = document.createElement("tr")
			var th_td = document.createElement("th")
			th_td.innerHTML = "Linie"
			th.appendChild(th_td)
			
			var th_td2 = document.createElement("th")
			th_td2.innerHTML = "Richtung"
			th.appendChild(th_td2)
			
			var th_td3 = document.createElement("th")
			th_td3.innerHTML = "Abfahrt"
			th.appendChild(th_td3)
			
			table.appendChild(th);		
			
			for (let index = 0; index < this.config.maxDepartures ; index++) {
				
				// make new table  row
				var tableRow = document.createElement("tr");
				const element = depts.departures[index];
				
				// show only this direction:
				if (element.directionId == this.config.direction) {
					
					var icon = this.config.showIcons ? `<td class="icon"><img class="grayscale" src="https://cloud.geofox.de/icon/linename?name=${element.line.name}&height=20&outlined=true&fileFormat=SVG"/></td>` : ''
					// add dable data:
					var line_result_td = document.createElement("td");
					line_result_td.className = "line"
					line_result_td.innerHTML = icon; // + element.line.name;	
					tableRow.appendChild(line_result_td);
					
					var direction_result_td = document.createElement("td");	
					direction_result_td.className = "direction"
					direction_result_td.innerHTML = element.line.direction;	
					tableRow.appendChild(direction_result_td);
					
					var departure_time_td = document.createElement("td");	
					departure_time_td.className = "time"
					var time_Off = element.timeOffset == 0 ? "gerade eben" : "in "+ element.timeOffset + " min (+" + element.delay / 60 + ")";
					departure_time_td.innerHTML = time_Off ;	
					tableRow.appendChild(departure_time_td);
					
					// append the table tow
					table.appendChild(tableRow)
				}
			} 
			
			// add table
			wrapper.appendChild(table);
		} 
					
		// pass the created content back to MM to add to DOM.
		return wrapper;
	},

})