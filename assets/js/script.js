//Save refereence to DOM elements
var currentTime = $("#current-time");
var search = $("#search-button");

//Handle display time
function displayTime() {
  return moment().format("MM/DD/YYYY");
}

//Handle local storage
function loadSeachHistory() {
  var allCities = JSON.parse(localStorage.getItem("searchHistory") || "[]"); //read items from storage, return empty array if nothing exists

  //Display city in search histroy
  for (value of allCities) {
    var singleSearch = $("<li>")
      .addClass("list-group-item")
      .text(value)
      .on("click", function (e) {
        getWeatherData(e.target.innerText);
      });

    $(".list-group").append(singleSearch);
  }
  if (allCities.length > 0) getWeatherData(allCities[0]); //pass first city to the function to display its weather
}

loadSeachHistory();

//Handle form submit
$("#my-form").on("submit", function (e) {
  e.preventDefault();
  var city = $("#search-input").val().toLowerCase(); //get city name from user input
  getWeatherData(city);
  console.log("city", city);
});

function getWeatherData(city) {
  if (city === "") {
    return false; //don't return results if search is empty
  }

  //clear search field after user searches a city
  $("#search-input").val("");

  requestUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    encodeURIComponent(city) +
    "&limit=5&appid=e6eb53717feb8f61869e78a5635478ed";
  //call first api with city passed from user
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      if (data.length === 0) {
        //check if city is not valid
        alert("Please enter a valid city");
        return;
      }

      //handle search histroy
      var mySearch = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      if (!mySearch.includes(city)) {
        //prevent duplicate entries
        mySearch.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(mySearch));
        var newItem = $("<li>").addClass("list-group-item").text(city);

        $(".list-group").append(newItem);
      }
      //second api call
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
          console.log(data);

          $("#city").text(city.charAt(0).toUpperCase() + city.slice(1)); //display city name
          $("#today-date").text("(" + displayTime() + ")"); //display today's time by calling the function

          //building today's weather page
          var imgSrc =
            "http://openweathermap.org/img/wn/" +
            data.current.weather[0].icon +
            "@2x.png";

          $("#image").attr("src", imgSrc);
          $("#temp").text("Temperature: " + data.current.temp + " °F");
          $("#humid").text("Humidity: " + data.current.humidity + "%");
          $("#win-speed").text(
            "Wind Speed: " + data.current.wind_speed + " MPH"
          );
          $("#uv-index").text("UV Index: " + data.current.uvi);

          //UV Index color checks
          if (0 <= data.current.uvi <= 2) {
            $("#uv-index").css("background-color", "yellow");
          } else if (3 <= data.current.uvi <= 5) {
            $("#uv-index").css("background-color", "orange");
          } else if (data.current.uvi >= 6) {
            $("#uv-index").css("background-color", "red");
          }

          $("#forecast").empty(); // empty forecast div when search for another city
          //build the 5 day forecast
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

            var imgForecastSrc =
              "http://openweathermap.org/img/wn/" +
              data.daily[i].weather[0].icon +
              "@2x.png";

            var forecastImg = $("<img>").attr("src", imgForecastSrc);
            displayIcon.append(forecastImg);

            parentDiv.append(displayIcon);
            var displayHumid = $("<div>").text(
              "Humidity: " + data.daily[i].humidity
            );
            parentDiv.append(displayHumid);
          }
        });
    });
}
