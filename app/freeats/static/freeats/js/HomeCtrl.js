define('HomeCtrl', [
  'jquery',
  'app',
  'eventBus',
  'facebookService'
],
function ($, app, eventBus, facebookService) {
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
      var Vote = $resource('/freeats/vote');
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
        });
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      };
      var Food = $resource('/freeats/food');
      $scope.submitPost = function () {
        var post = angular.copy($scope.newPost);
        post.user_id = $rootScope.fbUserId;
        post.access_token = $rootScope.fbAccessToken;
        console.log(post);
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
        Food.query(params, function (results) {
          var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          $scope.foodCollection = [];
          for (var i = 0; i < results.length; i++) {
            var food = angular.copy(results[i]);
            //food.id = results[i].pk;
            food.letter = letters[i % letters.length];
            food.post = food.description;
            delete food.description;
            food.upvotes = '0%';
            food.downvotes = '100%';
            if (food.votes > 0) {
              food.upvotes = (food.likes / food.votes)*100 + '%';
              food.downvotes = ((food.votes-food.likes) / food.votes)*100 + '%';
            }
            eventBus.emit('addMapMarker', food.location);
            $scope.foodCollection.push(food);
          }
          console.log($scope.foodCollection);
        });
      };
      /*$scope.foodCollection = [
        {
          id: 1,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'A',
          upvotes: '75%',
          downvotes: '25%',
          vote: 'up',
          post: "There's some free pizza on main walkway.\
                Diabetes Australia is raising awareness for type 2 diabetes...\
                Come get it while it's hot!",
          fromFacebook: true,
          pic: true
        },
        {
          id: 2,
          title: 'Cereal',
          location: 'Library lawn',
          letter: 'B',
          upvotes: '95%',
          downvotes: '5%',
          vote: 'up',
          post: "Get you're daily breakfast at the library lawn.\
                Wide variety of cereal to choose from"
        },
        {
          id: 3,
          title: 'CSESoc BBQ',
          location: 'Physics lawn',
          letter: 'C',
          upvotes: '40%',
          downvotes: '60%'
        },
        {
          id: 4,
          title: 'Pizza',
          location: 'Globe lawn',
          letter: 'D',
          upvotes: '40%',
          downvotes: '60%',
          vote: 'down'
        }
      ];*/

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