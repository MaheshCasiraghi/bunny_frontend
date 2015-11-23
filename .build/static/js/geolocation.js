
// Wait for the geocoder object to be instatntiated before 
// looking up for the position object through the navigator 
// geolocation browser API through

function startUp() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 
}

function initializeGeo() {
    geocoder = new google.maps.Geocoder()
    startUp();
}

function initialize() {
  initializeGeo()
}

// Once the position object is instantiated we can initialize both the
// gmaps city lookup and the twitter feed API

function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

// lookup the City with the gmaps City lookup by means of the codeLatLng function
    codeLatLng(lat, lng);
// initialize the twitter stream fetch on the basis of lat and long   
    getData(lat, lng).success(handleData);
}

function errorFunction(){
    alert("Geocoder failed");
}

//Gmaps City lookup by means of the geocoder object from gmaps API
// and the position object from the navigator API


function codeLatLng(lat, lng) {


  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
       //formatted address

      //find country name
           for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city= results[0].address_components[i];
                  break;
              }
          }
      }
      //city data
      $("#locationFillA").html(city.short_name)
      $("#locationFillB").html(city.short_name)

      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
}


