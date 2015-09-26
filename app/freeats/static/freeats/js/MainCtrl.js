define('MainCtrl', [
  'jquery',
  'app',
  'eventBus'
],
function ($, app, eventBus) {
  // Create main controller and attach it to the angular app
  app.controller(
    'MainCtrl',
    function ($scope, $resource) {
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
                .hide()
                .css({ display: 'inline-block' })
                .fadeIn(400);
            }, 500);
          }
        }
      };
      $scope.mobileBackButton = function () {
        eventBus.emit('showMapOverview');
        $scope.toggleMapOverview = false;

        $('.mobile-back-button').fadeOut(400, function () {
          var items = $('.item-panel .item');
          items.each(function (index, element) {
            $(element).slideDown(500);
          });
        });
      };
      $scope.upvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'up';
        // Make and PUT HTTP request to update the vote for current food item
      };
      $scope.downvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'down';
        // Make and PUT HTTP request to update the vote for current food item
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      };

      $scope.foodCollection = [
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
      ];
    }
  );

  return {
    show: function () {
      $('.item-panel .item').hide();
      $('.mobile-top-bar').fadeTo(400, 1);
      $('.item-panel').fadeTo(400, 1);
      $('.top-right').fadeTo(400, 1);
      $('.bottom-right').fadeTo(400, 1);
      var items = $('.item-panel .item');
      items.each(function (index, element) {
        $(element).slideDown(500);
      });
    }
  };
});