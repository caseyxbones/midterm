

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
//what we want to visualize later in the application:

  var allTypes = _.map(crimeData, function(item){
    return item.text_general_code;
  });
  console.log(_.groupBy(allTypes));

//   var theftFilter = _.filter(crimeData, function(crimeObject){
//       return crimeObject.text_general_code == "Weapon Violations";
//   });
// console.log(theftFilter);







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
  console.log(crimeData);
});

// This connects the previous button click to your functions
// will set the style based on the current state
$("#button-previous").click(function(event) {
  prevSlide();
  saySlideName();
  setStyle(nextSlide);
});
