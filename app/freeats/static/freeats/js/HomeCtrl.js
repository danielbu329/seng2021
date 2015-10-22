define('HomeCtrl', [
  'jquery',
  'app',
  'eventBus',
  'facebookService',
  'moment-timezone-data'
],
function ($, app, eventBus, facebookService, moment) {
  // Create main controller and attach it to the angular app
  app.controller(
    'HomeCtrl',
    function ($rootScope, $scope, $resource, facebookService) {
      console.log('HomeCtrl');
      facebookService.init();
      $rootScope.currentView = 'home';
      $rootScope.loggedIn = false;

      $rootScope.getFacebookLoginStatus(function () {
        $scope.updateFoodList();
        (function loop() {
          setTimeout(function () {
            $scope.updateFoodList();
            loop();
          }, 5000);
        })();
        var MyStats = $resource('/mystats');
        var stats = MyStats.get({
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        }, function () {
          $rootScope.admin_status = stats.admin_status;
        });
      });

      var getItemById = function (id) {
        var item = null;
        for (i in $scope.foodCollection) {
          var j = $scope.foodCollection[i];
          if (j.id == id) {
            item = j;
            break;
          }
        }
        return item;
      }
      var updateCurrentItem = function () {
        if ($scope.currentItem) {
          $scope.currentItem = getItemById($scope.currentItem.id);
        }
      };
      $scope.formatTime = function (time) {
        var t = moment.tz(time, 'UTC'); // Parse the time as UTC first
        return t.tz('Australia/Sydney').fromNow(); // Convert to AEST
      };
      $scope.showFoodDetail = function ($event, id) {
        $event.stopImmediatePropagation();
        $scope.currentItem = getItemById(id);
        $('#foodDetailModal').modal();
      };
      $scope.showFoodOnMap = function ($event, id) {
        $scope.currentItem = getItemById(id);
        if ($scope.toggleMapOverview) {
          eventBus.emit('showMapOverview');
          $scope.toggleMapOverview = false;
        } else {
          eventBus.emit('showFoodOnMap', $scope.currentItem.location);
          $scope.toggleMapOverview = true;

          // Mobile UI handling
          if ($(window).width() <= 860) {
            var items = $('.item-panel .item');
            items.each(function (index, element) {
              $(element).slideUp(500);
            });

            setTimeout(function () {
              $('.mobile-back-button')
                .css({ display: 'inline-block' })
                .hide()
                .fadeIn(400);
            }, 500);
          }
        }
      };
      $scope.mobileBackButton = function () {
        eventBus.emit('showMapOverview');
        $scope.toggleMapOverview = false;

        $('.mobile-back-button').hide();
        var items = $('.item-panel .item');
        items.each(function (index, element) {
          $(element).slideDown(500);
        });
      };
      var Vote = $resource('/vote');
      $scope.upvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'up';
        var vote = {
          postId: itemId, vote: 'up',
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        };
        Vote.save(vote, function () {
          console.info('Vote saved');
          $scope.updateFoodList();
          updateCurrentItem();
        }, function () {
          $rootScope.loginFacebook();
        });
      };
      $scope.downvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'down';
        var vote = {
          postId: itemId, vote: 'down',
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        };
        Vote.save(vote, function () {
          console.info('Vote saved');
          $scope.updateFoodList();
          updateCurrentItem();
        }, function () {
          $rootScope.loginFacebook();
        });
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      };
      var Food = $resource('/food');
      $scope.submitPost = function () {
        var post = angular.copy($scope.newPost);
        post.user_id = $rootScope.fbUserId;
        post.access_token = $rootScope.fbAccessToken;
        // Need to validate post data still
        Food.save(post, function () {
          console.info('Post saved');
          $('#newPostModal').modal('hide');
          $scope.newPost = {};
          $scope.updateFoodList();
        });
      };

      $scope.updateFoodList = function () {
        var params = {
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        };
        eventBus.on('foundDistance', function (data) {
          getItemById(data.postId).distance = data.distance;
        });
        Food.query(params, function (results) {
          var locations = {};
          var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          $scope.foodCollection = [];
          eventBus.emit('clearMapMarkers');
          for (var i = 0; i < results.length; i++) {
            var food = angular.copy(results[i]);
            if (food.location.toLowerCase() in locations) {
              food.letter = locations[food.location.toLowerCase()];
            } else {
              food.letter = letters[i % letters.length];
              locations[food.location.toLowerCase()] = food.letter;
            }
            food.post = food.description;
            delete food.description;
            food.creation_time = food.creation_time.replace(/T/, ' ').replace(/Z/, '');
            food.upvotes = '0%';
            food.downvotes = '100%';
            if (food.votes > 0) {
              food.upvotes = (food.likes / food.votes)*100 + '%';
              food.downvotes = (food.dislikes / food.votes)*100 + '%';
            }
            eventBus.emit('addMapMarker', {
              location: food.location,
              letter: food.letter
            });
            $scope.foodCollection.push(food);
            eventBus.emit('findDistance', {
              postId: food.id,
              location: food.location
            });
          }
          eventBus.emit('setMapAnimation', false);
        });
      };

      var animateLoading = function () {
        $('.loading img').animate({
          top: '-50px'
        }, 300, function () {
          $('.loading img').animate({
            top: 0
          }, 200);
        });
      };
      var intervalId;
      if (!($rootScope.mapLoaded)) {
        animateLoading();
        intervalId = setInterval(animateLoading, 700);
      } else {
        $($('.map')[0]).fadeTo(400, 1);
        eventBus.emit('showHomeCtrl');
      }

      eventBus.on('showHomeCtrl', function () {
        clearInterval(intervalId);
        $('.loading').hide();
        $('.item-panel .item').hide();
        $('.mobile-top-bar').fadeTo(400, 1);
        $('.item-panel').fadeTo(400, 1);
        $('.top-right').fadeTo(400, 1);
        $('.bottom-right').fadeTo(400, 1);
        var items = $('.item-panel .item');
        items.each(function (index, element) {
          $(element).slideDown(500);
        });
      });
      eventBus.on('mapLoaded', function () {
        $rootScope.mapLoaded = true;
        eventBus.emit('showMap');
      });

      if ($rootScope.mapLoaded) {
        eventBus.emit('showMap');
      }
    }
  );
});