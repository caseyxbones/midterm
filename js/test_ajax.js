$.ajax({
    url: "https://data.phila.gov/resource/sspu-uyfa.json",
    type: "GET",
    data: {
      // "$query" : "SELECT * WHERE shape is not null",
      "$query" : "SELECT * WHERE dispatch_date LIKE '2016%' AND shape is not null",                     // This automatically gets rid of any data without a shape and coordinates
      "$$app_token" : "nZtsnVJLQrElo9WkVcHn005wJ"
    }
}).done(function(data) {                                                    // anything that uses crimeData has to happen inside this done function or after a click event
  console.log("Retrieved " + data.length + " records from the dataset!");
  crimeData = (data);
});
