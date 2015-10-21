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
  var scienceTheatre = {lat: -33.917544, lng: 151.229653};
  var quadLawn = {lat: -33.916985, lng: 151.231100};
  var scientiaLawn = {lat: -33.917911, lng: 151.232851};
  var johnLionsGarden = {lat: -33.918644, lng: 151.231079};
  var arcLocation = {lat: -33.916749, lng: 151.231592};
  var collegeRoadLawn = {lat: -33.916354, lng: 151.229548};
  var selectedLocation = unsw;
  var doAnimation = true;
  var currentLocation = null;
  var myLocation = {lat: 0, lng: 0};

  var locations = {
    'Main Walkway': mainWalkway,
    'Library lawn': libaryLawn,
    'Physics lawn': physicsLawn,
    'Globe lawn': globeLawn,
    'Science Theatre': scienceTheatre,
    'Quad Lawn': quadLawn,
    'Scientia Lawn': scientiaLawn,
    'John Lions Garden': johnLionsGarden,
    'Arc': arcLocation,
    'College Road Lawn': collegeRoadLawn
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
      animation: doAnimation ? google.maps.Animation.DROP : null,
      map: map
    });
    markers.push(marker);
  };

  var deleteMarkers = function () {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    labelIndex = 0;
  };

  var findDistance = function (location) {
    var myLatlng = new google.maps.LatLng(myLocation.lat, myLocation.lng);
    var myLatlng2 = new google.maps.LatLng(location.lat, location.lng);
    return google.maps.geometry.spherical.computeDistanceBetween(myLatlng, myLatlng2);
  }

  var findLocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        myLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (currentLocation == null) {
          currentLocation = new google.maps.Marker({
            position: myLocation,
            label: "M",
            animation: google.maps.Animation.DROP,
            map: map
          });
        }
        currentLocation.setPosition(myLocation);
      });
    }
  };

  var addBorder = function () {
    var everythingElse = [
      new google.maps.LatLng(-33.90, 151.21),
      new google.maps.LatLng(-33.95, 151.21),
      new google.maps.LatLng(-33.95, 151.29),
      new google.maps.LatLng(-33.90, 151.29),
    ];

    var layoutCoords = [
      new google.maps.LatLng(-33.916019, 151.234596),
      new google.maps.LatLng(-33.916233, 151.234918),
      new google.maps.LatLng(-33.916482, 151.236656),
      new google.maps.LatLng(-33.919135, 151.236119),
      new google.maps.LatLng(-33.918512, 151.232214),
      new google.maps.LatLng(-33.920293, 151.231785),
      new google.maps.LatLng(-33.919563, 151.226313),
      new google.maps.LatLng(-33.914666, 151.225197),
    ];

    unswTrace = new google.maps.Polygon({
      paths: [everythingElse, layoutCoords],
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#000000",
      fillOpacity: 0.1
    });
    unswTrace.setMap(map);
  };
  addBorder();

  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
    console.info('Map loaded');
    eventBus.emit('mapLoaded');
  });

  eventBus.on('showMap', function () {
    deleteMarkers();
    findLocation();
    $($('.map')[0]).fadeTo(400, 1);
    setTimeout(function () {
      eventBus.emit('showHomeCtrl');
    }, 200);
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

  eventBus.on('clearMapMarkers', function () {
    deleteMarkers();
    findLocation();
  });

  eventBus.on('addMapMarker', function (locationName) {
    addMarker(locations[locationName], map);
  });

  eventBus.on('setMapAnimation', function (animate) {
    doAnimation = animate ? true : false;
  });

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