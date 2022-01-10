//Save refereence to DOM elements
var currentTime = $("#current-time");
var search = $("#search-button");

//Handle display time
function displayTime() {
  return moment().format("MM/DD/YYYY");
}

$("#search-button").on("click", getWeatherData);

function getWeatherData(e) {
  e.preventDefault();

  var city = $("#search-input").val();
  if (city === "") {
    return false;
  }

  //show search histroy
  var mySearch = [];
  mySearch.push($("#search-input").val());

  var singleSearch = $("<li>").addClass("list-group-item");
  singleSearch.text(mySearch);
  $(".list-group").append(singleSearch);

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
      console.log("lat is " + data[0].lat, "lon is " + data[0].lon);
      console.log(data);

      secondLink =
        "http://api.openweathermap.org/data/2.5/onecall?lat=" +
        data[0].lat +
        "&lon=" +
        data[0].lon +
        "&exclude=hourly&units=imperial&appid=e6eb53717feb8f61869e78a5635478ed";

      fetch(secondLink)
        .then(function (response) {
          console.log(response);
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          $("#city").text(city.charAt(0).toUpperCase() + city.slice(1));
          $("#today-date").text("("+displayTime()+")");
          $("#weather-condition").text(data.current.weather[0].main);
          $("#temp").text("Temperature: " + data.current.temp + " °F")
           $("#humid").text("Humidity: " + data.current.humidity + "%")
            $("#win-speed").text("Wind Speed: " + data.current.wind_speed + " MPH")
            $("#uv-index").text("UV Index: " + data.current.uvi)
          console.log("test here", data.current.weather[0].main);
        });
    });
}

$("#my-form").on("submit", getWeatherData);
