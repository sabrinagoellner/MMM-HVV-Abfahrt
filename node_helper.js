const NodeHelper = require("node_helper");
const request = require("request-promise");
const crypto = require('crypto');
const XMLHttpRequest = require('xhr2');

require('dotenv').config({path: '.env'})

// add require of other javascripot components here
// var xxx = require('yyy') here


module.exports = NodeHelper.create({

	init(){
		console.log("init module helper SampleModule");
	},

	start() {
		console.log('Starting module helper:' +this.name);
	},

	stop(){
		console.log('Stopping module helper: ' +this.name);
	},

    scrapeURL: function (url) {
        console.log('call URL: ' +this.name);

        // code here
        //var url = "https://gti.geofox.de/gti/public/init";
        //body = {}
        url = "https://gti.geofox.de/gti/public/departureList"

        var currentdate = new Date(); 
        var date = currentdate.getDate();
        var hours = currentdate.getHours();
        var min = currentdate.getMinutes();
        
        
        body = {
            "version":49,
            "station":{
               "name":"Rauhes Raus",
               "city":"Hamburg",
               "combinedName":"Hamburg, Rauhes Haus",
               "id":"Master:61901",
               "type":"STATION"
            },
            "time":{
               "date":""+ date +"",
               "time":""+ hours+ ":" + min +""
            },
            "maxList":10,
            "maxTimeOffset":30,
            "useRealtime":true
         }

         console.log("BODY: "+ body.time.time);

        var user = process.env.USER_NAME;
        var passwd = process.env.PASSWORD;

        function createSignature(requestBody) {
            const hmac = crypto.createHmac('sha1', passwd);
            hmac.update(JSON.stringify(requestBody));
            return hmac.digest('base64');
        }

        signature = createSignature(body);
        //console.log("SIG: " + signature);


        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("geofox-auth-type", "HmacSHA1");
        xhr.setRequestHeader("geofox-auth-user", user);
        xhr.setRequestHeader("geofox-auth-signature", signature);
        xhr.setRequestHeader("Host", "gti.geofox.de");
        xhr.setRequestHeader("Connection", "Keep-Alive");


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log("STATUS:" + xhr.status);
                //console.log("RESPONSE: " + xhr.responseText);
                response = xhr.responseText;
                return response;
            }
        };
        
        var data = JSON.stringify(body);
        
        xhr.send(data);
        
        console.log("type = " + typeof response);

        this.sendSocketNotification('SCRAPE_RESULT', response);
        //process xhr


    },


    socketNotificationReceived: function(notification, payload) {
        
        console.log('socketNotificationReceived: ' +this.name);


        if (notification === 'SCRAPE_URL') {
        
            this.scrapeURL(payload);
        }
    },

});