define('map', [
  'jquery',
  'lib/google.maps'
],
function ($, google) {
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var globeLawn = { lat: -33.917970, lng: 151.231202};
  var unsw = {lat: -33.9178745, lng: 151.2306935};

  console.log(google.maps.Map);
  var map = new google.maps.Map($('.map')[0], {
    center: unsw,
    zoom: 17,
    disableDefaultUI: true
  });

  var addMarker = function (location, map) {
    var marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      map: map
    });
  };

  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });

  addMarker(globeLawn, map);

  return map;
});