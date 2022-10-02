# MMM-HVV-Abfahrt
This Project is my very first module for the Magic Mirror 2.

It is displaying HVV-Transport Departures.

- it is using the Geofox API for getting the departures of a given time period.
- To access it you need access data (see: [https://www.hvv.de/de/fahrplaene/abruf-fahrplaninfos/datenabruf])
- put hte access data into .env variables



### Installation

```
cd ~/MagicMirror/modules
git clone https://github.com/nayemi/MMM-HVV-Abfahrt
cd MMM-HVV-Abfahrt
npm install
```
### Notice: dotenv (for the environment variables of sensitive login data)
Create an `.env` file in the root directory of the node.js (electron) project of Magic Mirror 2 
and put the variables `USER_NAME = "your-user-name-from-geofox-api"` and `PASSWORD =  "your-password-from-geofox-api"`. The module will look for them and use them in the encryption process of the request. Otherwise it will not work.

### config.js example
```
{
    module: "MMM-HVV-Abfahrt",
    position: "bottom_left",
    config: {
        header: "Abfahrten",
        message: "lade Abfahrten...", // loading message if no departures
        initialLoadDelay: 2000, // load delay on start
        updateInterval: 10000, // time in milliseconds when new data should be fetched
        maxDepartures: 10, // how much departures should be displayed
        timePeriod: 30, // time period (e.g departures in the period of 30 minutes from now) 
        showIcons: true, // show hvv icons or only text 
        stationName: "Rauhes Haus", // your station name for displaying
    }
},
```

Notice: this module is still in development, use it at your own risk ;)