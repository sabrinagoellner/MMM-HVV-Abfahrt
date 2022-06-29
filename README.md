# MMM-HVV-Abfahrt
My First module for the Magic Mirror displaying HVV Transport Departures.

- it is using the Geofox API for getting the departures of a given time period.
- To access it you need access data (see: [https://www.hvv.de/de/fahrplaene/abruf-fahrplaninfos/datenabruf])
- put hte access data into .env variables

### dependencies to install from npm 
- request-promise ( for requests)
- crypto ( for encrypting the request and your authentification)
- dotenv (for the environment variables of sensitive login data)
put the .env file in the root directory of the node.js project and put variables like USER_NAME = <your-user-name-from-geofox-api> and PASSWORD =  <your-password-from-geofox-api>

### config.js example
```
{
    module: "MMM-HVV-Abfahrt",
    position: "bottom_left",
    config: {
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
    }
},
```
###
Notice: this module is currently still in development, its not ready-to-use yet!