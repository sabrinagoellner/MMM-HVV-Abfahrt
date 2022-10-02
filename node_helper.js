const NodeHelper = require("node_helper");
const request = require("request-promise");
const crypto = require('crypto');
const XMLHttpRequest = require('xhr2');

require('dotenv').config({path: '.env'})

module.exports = NodeHelper.create({

	init(){
		console.log("init module helper " +this.name);
	},

	start() {
		console.log('Starting module helper:' +this.name);
	},

	stop(){
		console.log('Stopping module helper: ' +this.name);
	},

    getDepartures: function ( payload ) {

        timePeriod = payload[0]
        maxDepartures = payload[1]
        stationName = payload[2]

        //var response_name, response = undefined;

        var currentdate = new Date(); 
        var date = currentdate.getDate();
        var hours = currentdate.getHours();
        var min = currentdate.getMinutes();
        
        var user = process.env.USER_NAME;
        var passwd = process.env.PASSWORD;
        
        function createSignature(requestBody) {
            const hmac = crypto.createHmac('sha1', passwd);
            hmac.update(JSON.stringify(requestBody));
            return hmac.digest('base64');
        }
        
        //----------------
        //check name first
        body_name = {
            "version":51,
            "theName":{
                "name": stationName, 
                "type": "UNKNOWN"
            }, 
            "maxList":1, 
            "coordinateType":"EPSG_4326" 
        }
        
        signature_name = createSignature(body_name);
        url_name = "https://gti.geofox.de/gti/public/checkName";

        var xhr_name = new XMLHttpRequest();
        xhr_name.open("POST", url_name);

        xhr_name.setRequestHeader("Accept", "application/json");
        xhr_name.setRequestHeader("Content-Type", "application/json");
        xhr_name.setRequestHeader("geofox-auth-type", "HmacSHA1");
        xhr_name.setRequestHeader("geofox-auth-user", user);
        xhr_name.setRequestHeader("geofox-auth-signature", signature_name);
        //xhr_name.setRequestHeader("Host", "gti.geofox.de");
        //xhr_name.setRequestHeader("Connection", "Keep-Alive");


        xhr_name.onreadystatechange = function () {
            if (xhr_name.readyState === 4) {            
                
                response_name = xhr_name.responseText;
                
                console.log("response_name " + response_name);
                return response_name;
            } 
            
        };
        
        var data_name = JSON.stringify(body_name);
        xhr_name.send(data_name);
       
            
        res = JSON.parse(response_name)
        //console.log("HVV-Module Status: " + res.returnCode)

        station_id = res.results[0].id
        combined_name = res.results[0].combinedName
        city = res.results[0].city
        type = res.results[0].type

                    
        // create full request
        url_full = "https://gti.geofox.de/gti/public/departureList"
        body_full = {
            "version":51,
            "station":{
                "name":stationName, 
                "city": city,
                "combinedName": combined_name,
                "id": station_id, 
                "type": type
            },
            "time":{
                "date":""+ date +"",
                "time":""+ hours+ ":" + min +""
            },
            "maxList": maxDepartures,
            "maxTimeOffset":timePeriod,
            "useRealtime":true 
        }

        signature_full = createSignature(body_full);


        // full req:
        var xhr_full = new XMLHttpRequest();
        xhr_full.open("POST", url_full);

        xhr_full.setRequestHeader("Accept", "application/json");
        xhr_full.setRequestHeader("Content-Type", "application/json");
        xhr_full.setRequestHeader("geofox-auth-type", "HmacSHA1");
        xhr_full.setRequestHeader("geofox-auth-user", user);
        xhr_full.setRequestHeader("geofox-auth-signature", signature_full);
        //xhr_full.setRequestHeader("Host", "gti.geofox.de");
        //xhr_full.setRequestHeader("Connection", "Keep-Alive");


        xhr_full.onreadystatechange = function () {
            if (xhr_full.readyState === 4) {            
                response = xhr_full.responseText;
                return response;
            }
        };

        var data = JSON.stringify(body_full);
        xhr_full.send(data);

        //process xhr response 

        this.sendSocketNotification('GET_RESULT', response);
        
    
    },


    socketNotificationReceived: function(notification, payload) {
        
        if (notification === 'GET_DEPARTURES') {
        
            this.getDepartures(payload);
            
        }
    },

});