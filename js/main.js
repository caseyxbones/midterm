

$('#map').css('background-color', "#FEEBE2");

var state = {
  "count": 1,       // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.
  "slideData": [
    {
      "name": "Slide 0",
      "language": "Javascript",
      "description": "description of slide 1"
    },
    {
      "name": "Slide 1",
      "language": "Javascript",
      "description": "description of slide 2"
    },
    {
      "name": "Slide 2",
      "language": "Javascript",
      "description": "description of slide 3"
    },
    {
      "name": "Slide 3",
      "language": "Javascript",
      "description": "description of slide 4"
    },
    {
      "name": "Slide 4",
      "language": "Javascript",
      "description": "description of slide 5"
    }
  ]
};


var nextSlide = function () {
  if (state.count < state.slideData.length) {
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
});

// This connects the previous button click to your functions
// will set the style based on the current state
$("#button-previous").click(function(event) {
  prevSlide();
  saySlideName();
  setStyle(nextSlide);
});
