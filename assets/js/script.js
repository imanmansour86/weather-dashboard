//Save refereence to DOM elements
var currentTime = $("#current-time");
var search = $("#search-button");

//Handle display time
function displayTime() {
  var time = moment().format("MMMM Do YYYY, h:mm:ss a");
  currentTime.text(time);
}

$("#search-button").on("click", function (e) {
  e.preventDefault();

  var city = $("#search-input").val().trim();
  console.log(city);
  requestUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    encodeURIComponent(city) +
    ",CA,US&limit=5&appid=e6eb53717feb8f61869e78a5635478ed";

  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
});

setInterval(displayTime, 1000);
