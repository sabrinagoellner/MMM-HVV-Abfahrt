const NodeHelper = require("node_helper");
const request = require("request-promise");
const cheerio = require("cheerio");

// add require of other javascripot components here
// var xxx = require('yyy') here


// iframeUrl.js
const puppeteer = require("puppeteer");



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


    

    scrapeURL: async function (url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Goto page
        await page.goto(url);
        // Scroll down
        //page.evaluate((_) => window.scrollBy(0, 1000));
        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Get the src of the iframe
        const pageData = await page.evaluate(() =>{
            return {
                html: document.documentElement.innerHTML
            }
        })

        const $ = cheerio.load(pageData.html);
        const scrapedData = [];

        $(".js-tr-monitor-departure").each((index, element) => {

            const line_result_td = $(element).find('td .o-transport-icon__number').text();
            const direction_result_td = $($(element).find('td')[1]).text();
            const departure_time_td = $($(element).find('td')[2]).text();
            const tableRow = { line_result_td, direction_result_td, departure_time_td };            

            scrapedData.push(tableRow);
        });
            
        await browser.close();
        this.sendSocketNotification('SCRAPE_RESULT', scrapedData);

    },


    socketNotificationReceived: function(notification, payload) {
        

        if (notification === 'SCRAPE_URL') {
        
            this.scrapeURL(payload);
        }
    },

});