define('map', [
  'jquery',
  'lib/google.maps',
  'eventBus'
],
function ($, google, eventBus) {
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

  $($('.map')[0]).css({ display: 'block' });
  $($('.map')[0]).css({ opacity: 0 });
  var map = new google.maps.Map($('.map')[0], {
    center: unsw,
    zoom: 16,
    disableDefaultUI: true,
    scrollwheel: false
  });

  var markers = [];
  var addMarker = function (location, map) {
    var marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      animation: google.maps.Animation.DROP,
      map: map
    });
    markers.push(marker);
  };

  var deleteMarkers = function () {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  };

  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
    console.info('Map loaded');
    eventBus.emit('mapLoaded');
  });

  eventBus.on('showMap', function () {
    deleteMarkers();
    $($('.map')[0]).fadeTo(400, 1);
    setTimeout(function () {
      eventBus.emit('showHomeCtrl');
    }, 200);
    setTimeout( function() {
      labelIndex = 0;
      /*addMarker(mainWalkway, map);
      addMarker(libaryLawn, map);
      addMarker(physicsLawn, map);
      addMarker(globeLawn, map);*/
    }, 500);
  });

  var calculateXOffset = function () {
    if ($(window).width() > 860)
      return -1 * ($('.item-panel').width()/2 - 60);
    else
      return 0;
  };

  var calculateYOffset = function () {
    if ($(window).width() <= 860)
      return -1 * ($('.mobile-top-bar').height()/2);
    else
      return 0;
  };

  eventBus.on('showFoodOnMap', function (location) {
    selectedLocation = locations[location];
    map.setZoom(18);
    map.setCenter(selectedLocation);
    map.panBy(calculateXOffset(), calculateYOffset());
  });

  eventBus.on('showMapOverview', function () {
    selectedLocation = unsw;
    map.setZoom(16);
    map.setCenter(selectedLocation);
    map.panBy(calculateXOffset(), calculateYOffset());
  });

  eventBus.on('addMapMarker', function (locationName) {
    addMarker(locations[locationName], map);
  })

  var setupMapCentering = function () {
    return setInterval(function () {
      var offsetX = calculateXOffset();
      map.setCenter(selectedLocation);
      map.panBy(calculateXOffset(), calculateYOffset());
    }, 100);
  };
  var intervalId = setupMapCentering();

  eventBus.on('showMyPostsCtrl', function () {
    clearInterval(intervalId);
  });

  return map;
});