define('map', [
  'jquery',
  'lib/google.maps',
  'MainCtrl',
  'eventBus'
],
function ($, google, MainCtrl, eventBus) {
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
  var globeLawn = { lat: -33.917970, lng: 151.231202};
  var unsw = {lat: -33.9178745, lng: 151.2306935};
  var libaryLawn = {lat: -33.916785, lng: 151.233555};
  var physicsLawn = {lat: -33.919068, lng: 151.229847};
  var mainWalkway = {lat: -33.917521, lng: 151.228371};
  var selectedLocation = unsw;

  var locations = {
    'Main Walkway': mainWalkway,
    'Library lawn': libaryLawn,
    'Physics lawn': physicsLawn,
    'Globe lawn': globeLawn
  }

  $($('.map')[0]).css({ opacity: 0 });
  var map = new google.maps.Map($('.map')[0], {
    center: unsw,
    zoom: 16,
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
      addMarker(mainWalkway, map);
      addMarker(libaryLawn, map);
      addMarker(physicsLawn, map);
      addMarker(globeLawn, map);
    }, 500);
  });

  var calculateXOffset = function () {
    if ($(window).width() > 860)
      return -1 * ($('.item-panel').width()/2 - 60);
    else
      return 0;
  };

  eventBus.on('showFoodOnMap', function (location) {
    var offsetX = calculateXOffset();
    selectedLocation = locations[location];
    map.setZoom(18);
    map.setCenter(selectedLocation);
    map.panBy(offsetX, 0);
  });

  eventBus.on('showMapOverview', function () {
    var offsetX = calculateXOffset();
    selectedLocation = unsw;
    map.setZoom(16);
    map.setCenter(selectedLocation);
    map.panBy(offsetX, 0);
  });

  setInterval(function () {
    var offsetX = calculateXOffset();
    map.setCenter(selectedLocation);
    map.panBy(offsetX, 0);
  }, 100);

  return map;
});