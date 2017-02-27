////////////////////////////////////////////////////////////////////////////////////////
/////////////            THIS IS BASIC MAP AND ICON SETUP STUFF            /////////////
////////////////////////////////////////////////////////////////////////////////////////

$("#button-previous").hide();                           // This is here to make my button click events work properly later on

var magentaIcon = L.icon({                              // custom map icon 1
    iconUrl: 'images/magenta_ring.png',
    shadowUrl: null,
    iconSize:     [8,8], // size of the icon
});

var greenIcon = L.icon({                              // custom map icon 2
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

// var phlPoliceAreas = "https://raw.githubusercontent.com/caseyxbones/midterm/master/Boundaries_PSA.geojson";
// var featureGroup;
// var tempData;
//
// var myStyle = function(feature) {
//     switch (feature.type) {
//         case 'Feature': return {color: "#000000", fill: false, width: 1};
//     }
//   return {};
// };
//
// var eachFeatureFunction = function(layer) {
//   layer.on('click', function (event) {
//     var psaNumber = (layer.feature.properties.PSA_NUM);
//     $(".psa-number").text(layer.feature.properties.PSA_NUM);
//     // showResults();
//   });
// };
//
// $(document).ready(function() {
//   $.ajax(phlPoliceAreas).done(function(data) {
//     var parsedData = JSON.parse(data);
//     tempData = parsedData;
//     featureGroup = L.geoJson(parsedData, {
//       style: myStyle,
//       filter: null
//     }).addTo(map);
//     // quite similar to _.each
//     featureGroup.eachLayer(eachFeatureFunction);
//   });
// });



////////////////////////////////////////////////////////////////////////////////////////
/////////////   HERE IS WHERE I BRING DOWN THE CRIME DATA THROUGH AN API   /////////////
////////////////////////////////////////////////////////////////////////////////////////

$.ajax({
    url: "https://data.phila.gov/resource/sspu-uyfa.json",
    type: "GET",
    data: {
      "$query" : "SELECT * WHERE shape is not null",                        // This automatically gets rid of any data without a shape and coordinates
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

    var makeMarkersPink =  function (crimeFilter) {                                       // markers using the pink custom icon
        var markersTempPink = _.map(crimeFilter, function(crimeObject) {
          return L.marker([crimeObject.shape.coordinates[1], crimeObject.shape.coordinates[0]], {icon: magentaIcon})
          .bindPopup(crimeObject.text_general_code + " reported at " + crimeObject.location_block + " on " + crimeObject.dispatch_date);
        }
      );
      return markersTempPink;
    };

    var makeMarkersGreen =  function (crimeFilter) {                                      // markers using the green custom icon
        var markersTempGreen = _.map(crimeFilter, function(crimeObject) {
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
    var theftMarkers = makeMarkersPink(theftEvents);
    var theftSelect = makeMarkersPink(theft2016);
    var fraudMarkers = makeMarkersGreen(fraudEvents);
    var fraudSelect = makeMarkersGreen(fraud2016);

    // plotMarkers(allMarkers);

    var removeMarkers = function(markersAll) {
        _.each(markersAll, function (individualMarker){
          map.removeLayer(individualMarker);
        });
    };


    var changeMap = function () {
      if (state.count < 1) {
            // removeMarkers(allMarkers);
            removeMarkers(theftMarkers);
            removeMarkers(fraudMarkers);
      } else if (state.count === 1) {
            // removeMarkers(allMarkers);
            removeMarkers(theftMarkers);
            removeMarkers(fraudMarkers);
            $("#page_title").text("All Fraud & Theft from 2006 to Present");
            $("#main").text("The map to the right shows all of the Fraud and Theft incidents with geographic information for the city of Philadelphia from 2006 to present. To get more information on a specific incident, click on its marker!");
            $("#main2").hide();
            $("#main3").hide();
            plotMarkers(theftMarkers);
            plotMarkers(fraudMarkers);
      } else  if (state.count === 2) {
                // removeMarkers(allMarkers);
                // removeMarkers(theftMarkers);
                removeMarkers(fraudMarkers);
                $("#page_title").text("All  Theft: 2006 to Present");
                $("#main").text( "This is a subset of the full dataset, showing only thefts from 2006 to present.");
                $("#main2").hide();
                $("#main3").hide();
            // plotMarkers(theftMarkers);
      } else  if (state.count === 3) {
                removeMarkers(theftMarkers);
                removeMarkers(fraudMarkers);
                $("#page_title").text("Theft in 2016");
                $("#main").text("These are all of the thefts geocoded by the Philadelphia Police Department in 2016.");
                $("#main2").show();
                $("#main2").text("The scarcity of data points suggests that the data set might be incomplete. Either that, or Philadelphia is much safer than all the Penn Security e-mails we get each semester would suggest.");
                $("#main3").hide();
            plotMarkers(theftSelect);
      } else  if (state.count === 4) {
                removeMarkers(fraudMarkers);
                removeMarkers(theftSelect);
                $("#page_title").text("All Fraud: 2006 to Present");
                $("#main").text( "This is a subset of the full dataset, showing only thefts from 2006 to present.");
                $("#main2").hide();
                $("#main3").hide();
            plotMarkers(fraudMarkers);
      } else  if (state.count === 5) {
                // removeMarkers(allMarkers);
                removeMarkers(theftMarkers);
                removeMarkers(fraudMarkers);
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
            changeMap();
      } else if (state.count === 4) {
            nextSlide();
            saySlideName();
            $("#button-next").hide();
            changeMap();
      } else {
            nextSlide();
            saySlideName();
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
            changeMap();
      } else if (state.count === 1) {
            prevSlide();
            saySlideName();
            $("#button-previous").hide();
            changeMap();
      } else {
            prevSlide();
            saySlideName();
            changeMap();
      }
    });

// ALMOST ALL OF THIS HAS BEEN INSIDE A .done FUNCTION.
// THERE HAS TO BE A BETTER WAY TO DO THIS, NO?

});
