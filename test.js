// Upon page load, get the users location
// if location services is enabled, it will show a map of their area
// if location services are not enabled, it will show a generic map with a box that will allow them to 1 of 12 states
// Next, the user will input their zip code
// CHECK: does google take zip code as a parameter or do we need to convert zip to lat/lon
// We'll store the users location as lat/lon in a global variable
// We'll take the users lat/lon and input it into the COVID api/url
// The COVID api will return testing locations around that lat/lon

//test COVID api
let covidApiKey = "K39YR7g51qETSXocQ0uyEDBxgxXWFZSILwgtqcrNaP8";
let covidAppId = "ikc0ro0Fv33Mt3V90p6Y";

let covidApiUrl =
  "https://discover.search.hereapi.com/v1/discover?apikey=" +
  covidApiKey +
  "&q=Covid&at=30.22,-92.02&limit=10";

// function getCovidData() {
//   $.ajax({
//     url: covidApiUrl,
//     method: "GET",
//   }).then(function (response) {
//     console.log(response);
//   });
// }

// getCovidData();

//Initialize and add the map

let map, infoWindow;

function mapMaker(currentLat, currentLon) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: currentLat, lng: currentLon },
    zoom: 8,
  });
  infoWindow = new google.maps.InfoWindow();
}

if (navigator.geolocation) {
  //request the user's current location
  navigator.geolocation.getCurrentPosition((position) => {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    mapMaker(pos.lat, pos.lon);
    // Show a map centered at latitude / longitude.
    console.log(pos.lat, pos.lng);
    infoWindow.setPosition(pos);
    infoWindow.setContent("Current Location");
    infoWindow.open(map);
    // map.setCenter(pos);

    //add marker to my location
    const marker = new google.maps.Marker({
      position: pos,
      map: map,
    });
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
222;
