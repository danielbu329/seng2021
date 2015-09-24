define('map', [
  'jquery',
  'lib/google.maps',
  'MainCtrl'
],
function ($, google, MainCtrl) {
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var globeLawn = { lat: -33.917970, lng: 151.231202};
  var unsw = {lat: -33.9178745, lng: 151.2306935};

  $($('.map')[0]).css({ opacity: 0 });
  var map = new google.maps.Map($('.map')[0], {
    center: unsw,
    zoom: 17,
    disableDefaultUI: true,
    scrollwheel: false
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

  google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
    console.info('Map loaded');
    $($('.map')[0]).fadeTo(400, 1);
    setTimeout(MainCtrl.show, 200);
  });

  addMarker(globeLawn, map);

  return map;
});