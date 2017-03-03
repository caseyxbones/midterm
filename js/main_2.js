////////////////////////////////////////////////////////////////////////////////////////
/////////////            THIS IS BASIC MAP AND ICON SETUP STUFF            /////////////
////////////////////////////////////////////////////////////////////////////////////////

$("#button-previous").hide();                           // This is here to make my button click events work properly later on

var magentaIcon = L.icon({                              // custom map icon 1
    iconUrl: 'images/magenta_ring.png',
    shadowUrl: null,
    iconSize:     [8,8], // size of the icon
});

var greenIcon = L.icon({                               // custom map icon 2
    iconUrl: 'images/green_ring.png',
    shadowUrl: null,
    iconSize:     [8,8], // size of the icon
});

  var map = L.map('map', {                            // using a set of CartoDB tiles instead of Stamen tiles
    center: [39.986354, -75.097443],
    zoom: 11
  });

  var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);


// TRYING TO ADD THE OUTLINES OF POLICE SERVICE AREAS USING .GeoJSON FROM OPENDATAPHILLY
// NO SUCCESS SO FAR

var phlPoliceAreas = "https://raw.githubusercontent.com/caseyxbones/midterm/master/Boundaries_PSA.geojson";
var featureGroup;
var tempData;

// var myStyle = function(feature) {
//     switch (feature.type) {
//         case 'Feature': return {color: "#ffffff", fill: false, width: 10};
//     }
//   return {};
// };

lineStyle = {style: function(f){
  return {'weight': 1, fill: false, color: "#ffffff", dashArray: '5', opacity: 0.5};
}};



var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    var psaNumber = (layer.feature.properties.PSA_NUM);
    $(".psa-number").text(layer.feature.properties.PSA_NUM);
    showResults();
  });
};

$(document).ready(function() {
  $.ajax(phlPoliceAreas).done(function(data) {
    var parsedData = JSON.parse(data);
    tempData = parsedData;
    featureGroup = L.geoJson(parsedData, lineStyle).addTo(map);
    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
});



////////////////////////////////////////////////////////////////////////////////////////
/////////////   HERE IS WHERE I BRING DOWN THE CRIME DATA THROUGH AN API   /////////////
////////////////////////////////////////////////////////////////////////////////////////


$.ajax({
    url: "https://data.phila.gov/resource/sspu-uyfa.json",
    type: "GET",
    data: {
      // "$query" : "SELECT * WHERE shape is not null",
      "$query" : "SELECT * WHERE dispatch_date LIKE '2016%' AND shape is not null",                    // This automatically gets rid of any data without a shape and coordinates AND gives us ONLY data for 2016
      "$$app_token" : "nZtsnVJLQrElo9WkVcHn005wJ"
    }
}).done(function(data) {                                                    // anything that uses crimeData has to happen inside this done function or after a click event
  console.log("Retrieved " + data.length + " records from the dataset!");
  crimeData = (data);

// This will allow us to console.log out the various text general codes/crime types so that we can decide
// what we want to visualize later in the application:

  var allTypes = _.map(crimeData, function(item){
    return item.text_general_code;
  });
  // console.log(_.groupBy(allTypes));

  // This is the result of the console.log of allTypes:
          // Aggravated Assault No Firearm
          // All Other Offenses
          // Arson
          // Burglary Residential
          // Disorderly Conduct - Public Space/Disorder
          // Embezzlement
          // Fraud **
          // Gambling Violations
          // Homicide - Criminal - Violent Crime
          // Motor Vehicle Theft
          // Narcotic / Drug Law Violations - Public Space/Disorder
          // Other Assaults **
          // Rape - Violent Crime
          // Robbery Firearm - Violent Crime
          // Robbery No Firearm
          // Theft from Vehicle
          // Thefts **
          // Vagrancy/Loitering - Public Space/Disorder
          // Vandalism/Criminal Mischief - Public Space/Disorder
          // Weapon Violations

    // This will pull the year of the crime out of the dispatch date and create a new key for it
    // This will allow for more specific filtering/representation later
    _.each(crimeData, function (crimeEvent){
      crimeEvent.year = crimeEvent.dispatch_date.substring(0,4);
    });
    // console.log(crimeData);



////////////////////////////////////////////////////////////////////////////////////////
//////// HERE IS WHERE IM GONNA SET UP VARIOUS FILTERS FOR POINTS I WANT TO MAP ////////
////////////////////////////////////////////////////////////////////////////////////////

    var crimeFilter = _.filter(crimeData, function(crimeObject){
          return(crimeObject.text_general_code == "Thefts" || crimeObject.text_general_code == "Fraud");
    });

    var theftEvents = _.filter(crimeData, function(crimeObject){
          return(crimeObject.text_general_code == "Thefts");
    });

    var fraudEvents = _.filter(crimeData, function(crimeObject){
          return(crimeObject.text_general_code == "Fraud");
    });

    var selectCrimes = _.uniq(_.pluck(crimeFilter, 'text_general_code'));            // Aaron suggested I use this code to check my filtered set and make sure it only contains the two types of crimes I want
    // console.log(selectCrimes);                                                    // This is just a different way to do what I did above to get all the text_general_code options

    var selectYears = _.uniq(_.pluck(crimeFilter, 'year'));                         // Adapted Aaron's code to look at the years for the data, using the key I created earlier
    // console.log(selectYears);

    var fraud2016 = _.filter(fraudEvents, function(fraudObject){
          return(fraudObject.year == "2016");
    });

    var theft2016 = _.filter(theftEvents, function(theftObject){
          return(theftObject.year == "2016");
    });



////////////////////////////////////////////////////////////////////////////////////////
/////////////  HERE IS WHERE I CREATE MARKERS AND PLOT THEM ON EACH SLIDE  /////////////
////////////////////////////////////////////////////////////////////////////////////////

    // console.log(crimeFilter[0].shape.coordinates[0]);                                  // This is the second coordinate for each crimeObject
    // console.log(crimeFilter[0].shape.coordinates[1]);                                  // This is the first coordinate for each crimeObject


    var makeMarkersPink =  function (crimeData) {                                       // markers using the pink custom icon
        var markersTempPink = _.map(crimeData, function(crimeObject) {
          return L.marker([crimeObject.shape.coordinates[1], crimeObject.shape.coordinates[0]], {icon: magentaIcon})
          .bindPopup(crimeObject.text_general_code + " reported at " + crimeObject.location_block + " on " + crimeObject.dispatch_date);
        }
      );
      return markersTempPink;
    };

    var makeMarkersGreen =  function (crimeData) {                                      // markers using the green custom icon
        var markersTempGreen = _.map(crimeData, function(crimeObject) {
          return L.marker([crimeObject.shape.coordinates[1], crimeObject.shape.coordinates[0]], {icon: greenIcon})
          .bindPopup(crimeObject.text_general_code + " reported at " + crimeObject.location_block + " on " + crimeObject.dispatch_date);
        }
      );
      return markersTempGreen;
    };

    var plotMarkers = function(markersAll) {
        _.each(markersAll, function (individualMarker) {
          individualMarker.addTo(map);
        }
        );
    };

    // var allMarkers = makeMarkers(crimeFilter);
    var all2016markers = makeMarkersPink(crimeData);
    var theftMarkers = makeMarkersPink(theftEvents);
    var theftSelect = makeMarkersPink(theft2016);
    var fraudMarkers = makeMarkersGreen(fraudEvents);
    var fraudSelect = makeMarkersGreen(fraud2016);
    var allMarkers = [theftMarkers, theftSelect, fraudMarkers, fraudSelect];

    // plotMarkers(allMarkers);

    var removeMarkers = function(markersAll) {                                          // this function will remove markers for individual filters
        _.each(markersAll, function (individualMarker){
          map.removeLayer(individualMarker);
        });
    };

    var clearMap = function () {                                                        // this function will clear the map, called in button clicks
        removeMarkers(theftMarkers);
        removeMarkers(fraudMarkers);
        removeMarkers(theftSelect);
        removeMarkers(fraudSelect);
        removeMarkers(all2016markers);
    };

    var changeMap = function () {                                                     // this will change the page contents dependiong on the state count, called in button clicks
      if (state.count < 1) {
            $("#page_title").text("Mapping Crime in Philadelphia");
            $("#main").text("The city of Philadelphia provides data on Part 1 and Part 2 Crime Incidents through OpenDataPhilly.org. Part 1 & Part 2 Crime Incidents from the Police Department's INCT system with generalized UCR codes and addresses rounded to the hundred block. These counts may not coincide exactly with data that is submitted to the Uniformed Crime Reporting (UCR) system.");
            $("#main2").show();
            $("#main3").show();
            plotMarkers(all2016markers);
      } else if (state.count === 1) {
            $("#page_title").text("All Fraud & Theft from 2006 to Present");
            $("#main").text("The map to the right shows all of the Fraud and Theft incidents with geographic information for the city of Philadelphia from 2006 to present. To get more information on a specific incident, click on its marker!");
            $("#main2").hide();
            $("#main3").hide();
            plotMarkers(theftMarkers);
            plotMarkers(fraudMarkers);
      } else  if (state.count === 2) {
            $("#page_title").text("All  Theft: 2006 to Present");
            $("#main").text( "This is a subset of the full dataset, showing only thefts from 2006 to present.");
            $("#main2").hide();
            $("#main3").hide();
            plotMarkers(theftMarkers);
      } else  if (state.count === 3) {
            $("#page_title").text("Theft in 2016");
            $("#main").text("These are all of the thefts geocoded by the Philadelphia Police Department in 2016.");
            $("#main2").show();
            $("#main2").text("The scarcity of data points suggests that the data set might be incomplete. Either that, or Philadelphia is much safer than all the Penn Security e-mails we get each semester would suggest.");
            $("#main3").hide();
            plotMarkers(theftSelect);
      } else  if (state.count === 4) {
            $("#page_title").text("All Fraud: 2006 to Present");
            $("#main").text( "This is a subset of the full dataset, showing only thefts from 2006 to present.");
            $("#main2").hide();
            $("#main3").hide();
            plotMarkers(fraudMarkers);
      } else  if (state.count === 5) {
            $("#page_title").text("Fraud in 2016");
            $("#main").text("These are all of the thefts geocoded by the Philadelphia Police Department in 2016.");
            $("#main2").show();
            $("#main2").text("Again, the scarcity of data points suggests that the data set might be incomplete.");
            $("#main3").hide();
            plotMarkers(fraudSelect);
    }
    };


////////////////////////////////////////////////////////////////////////////////////////
/////////////           THIS IS THE PART THAT ACTUALLY DOES STUFF          /////////////
////////////////////////////////////////////////////////////////////////////////////////
    // plotMarkers(all2016markers);

    var state = {
      count: 0,
      data: undefined,
    };

    var nextSlide = function () {
      if (state.count < 5) {
        state.count = (state.count + 1);
        // console.log("Slide" + " " + state.count);
      }
      else {
        console.log("You are on the last slide!");
      }
    };

    var prevSlide = function() {
      if (state.count > 0) {
        state.count = (state.count - 1);
        // console.log("Slide" + " " + state.count);
      }
      else {
        console.log("You are on the first slide!");
      }
    };

    var saySlideName = function() {
      var slideDataInfo = state.count;
      console.log("You are on slide" + " " + [state.count]);
    };

    saySlideName();

    // This connects the next button click to your functions
    // will set the style based on the current state
    $("#button-next").click(function(event) {
      if (state.count === 0 ) {
            $("#button-previous").show();
            nextSlide();
            saySlideName();
            clearMap();
            changeMap();
      } else if (state.count === 4) {
            nextSlide();
            saySlideName();
            $("#button-next").hide();
            clearMap();
            changeMap();
      } else {
            nextSlide();
            saySlideName();
            clearMap();
            changeMap();
      }
    });

    // This connects the previous button click to your functions
    // will set the style based on the current state
    $("#button-previous").click(function(event) {
      if (state.count === 5) {
            prevSlide();
            saySlideName();
            $("#button-next").show();
            clearMap();
            changeMap();
      } else if (state.count === 1) {
            prevSlide();
            saySlideName();
            $("#button-previous").hide();
            clearMap();
            changeMap();
      } else {
            prevSlide();
            saySlideName();
            clearMap();
            changeMap();
      }
    });

// ALMOST ALL OF THIS HAS BEEN INSIDE A .done FUNCTION.
// THERE HAS TO BE A BETTER WAY TO DO THIS, NO?

});
