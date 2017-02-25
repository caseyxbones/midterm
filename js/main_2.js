

$('#map').css('background-color', "#FEEBE2");

$.ajax({
    url: "https://data.phila.gov/resource/sspu-uyfa.json",
    type: "GET",
    data: {
      // "$limit" : 200,                                                    // This line breaks the ajax call when the query is happening so I commented it out
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

    var theftFilter = _.filter(crimeData, function(crimeObject){                    // This creates a filter for just Thefts in the dataset
          return(crimeObject.text_general_code == "Thefts");
      });
    console.log(theftFilter);

    var allYears = _.map(theftFilter, function(item){                             // This will pull out all the dates of all the thefts so we can see them
      return item.dispatch_date;
    });
    // console.log(_.groupBy(allYears));

    // This is the result of the console.log of allYears:
          // 2006
          // 2007
          // 2009
          // 2010
          // 2011
          // 2012
          // 2013
          // 2014
          // 2015
          // 2016








});

var crimeData;






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var state = {
  count: 1,
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
  if (state.count > 1) {
    state.count = (state.count - 1);
    // console.log("Slide" + " " + state.count);
  }
  else {
    console.log("You are on the first slide!");
  }
};

var saySlideName = function() {
  var slideDataInfo = state.count;
  console.log("You are on slide" + " " + [slideDataInfo]);
};

var changeColor = function () {
  if (state.count === 0) {
    return "#FEEBE2";
  } else if (state.count === 1) {
    return "#FBB4B9";
  } else  if (state.count === 2) {
    return "#F768A1";
  } else  if (state.count === 3) {
    return "#C51B8A";
  } else  if (state.count === 4) {
      return "#7A0177";
  } else  if (state.count === 5) {
    return "#B30000";
}
};

var setStyle = function(slideObject) {
    $('#map').css('background-color', changeColor());
};




// This connects the next button click to your functions
// will set the style based on the current state
$("#button-next").click(function(event) {
  nextSlide();
  saySlideName();
  setStyle(nextSlide);
  // console.log(crimeData);
});

// This connects the previous button click to your functions
// will set the style based on the current state
$("#button-previous").click(function(event) {
  prevSlide();
  saySlideName();
  setStyle(nextSlide);
});
