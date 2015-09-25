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
  var libaryLawn = {lat: -33.916785, lng: 151.233555};
  var physicsLawn = {lat: -33.919068, lng: 151.229847};
  var mainWalkway = {lat: -33.917521, lng: 151.228371};

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
      animation: google.maps.Animation.DROP,
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
    window.setTimeout( function() {
      addMarker(globeLawn, map);
      addMarker(libaryLawn, map);
      addMarker(physicsLawn, map);
      addMarker(mainWalkway, map);
    }, 500);
  });

  map.addListener('center_changed', function() {
    window.setTimeout(function() {
      map.panTo(unsw);
    }, 500);
  });





  return map;
});