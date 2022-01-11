//Save refereence to DOM elements
var currentTime = $("#current-time");
var search = $("#search-button");

//Handle display time
function displayTime() {
  return moment().format("MM/DD/YYYY");
}

function loadSeachHistory() {
  var allCities = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  for (value of allCities) {
    var singleSearch = $("<li>")
      .addClass("list-group-item")
      .text(value)
      .on("click", function (e) {
        getWeatherData(e.target.innerText);
      });

    $(".list-group").append(singleSearch);
  }
  if (allCities.length > 0) getWeatherData(allCities[0]);
}

loadSeachHistory();

$("#my-form").on("submit", function (e) {
  e.preventDefault();
  var city = $("#search-input").val().toLowerCase();
  getWeatherData(city);
});

function getWeatherData(city) {
  console.log(city);
  if (city === "") {
    return false;
  }

  $("#search-input").val("");

  //show search histroy
  var mySearch = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  if (!mySearch.includes(city)) {
    mySearch.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(mySearch));
    var newItem = $("<li>").addClass("list-group-item").text(city);

    $(".list-group").append(newItem);
  }

  requestUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    encodeURIComponent(city) +
    "&limit=5&appid=e6eb53717feb8f61869e78a5635478ed";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      secondLink =
        "http://api.openweathermap.org/data/2.5/onecall?lat=" +
        data[0].lat +
        "&lon=" +
        data[0].lon +
        "&exclude=hourly&units=imperial&appid=e6eb53717feb8f61869e78a5635478ed";

      fetch(secondLink)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //  uvIndex=[favorable, moderate, or severe];

          $("#city").text(city.charAt(0).toUpperCase() + city.slice(1));
          $("#today-date").text("(" + displayTime() + ")");
          $("#weather-condition")
            .removeClass()
            .addClass(getIcon(data.current.weather[0].main));
          $("#temp").text("Temperature: " + data.current.temp + " °F");
          $("#humid").text("Humidity: " + data.current.humidity + "%");
          $("#win-speed").text(
            "Wind Speed: " + data.current.wind_speed + " MPH"
          );
          $("#uv-index").text("UV Index: " + data.current.uvi);

          $("#date-1").text(moment().add(1, "d").format("MM/DD/YYYY"));

          $("#forecast").empty();
          //build the forecast
          for (i = 1; i < 6; i++) {
            var parentDiv = $("<div>").attr("id", "day-card");
            $("#forecast").append(parentDiv);
            var displayDate = $("<div>").text(
              moment(data.daily[i].dt * 1000).format("MM/DD/YYYY")
            );
            parentDiv.append(displayDate);
            var displayTemp = $("<div>").text(
              "Temp: " + data.daily[i].temp.day
            );
            parentDiv.append(displayTemp);

            var displayIcon = $("<div>");
            var icon = $("<i>").addClass(
              getIcon(data.daily[i].weather[0].main)
            );
            displayIcon.append(icon);

            parentDiv.append(displayIcon);
            var displayHumid = $("<div>").text(
              "Humidity: " + data.daily[i].humidity
            );
            parentDiv.append(displayHumid);
          }
        });
    });
}

function getIcon(value) {
  switch (value) {
    case "Clouds":
      return "fas fa-cloud";
      break;
    case "Rain":
      return "fas fa-cloud-rain";
      break;
    case "Snow":
      return "fas fa-snowflake";
    case "Clear":
      return "fas fa-sun";
    default:
      return "fas fa-question";
  }
}
