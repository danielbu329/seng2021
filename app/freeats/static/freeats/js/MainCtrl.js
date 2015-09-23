define('MainCtrl', [
  'jquery',
  'app'
],
function ($, app) {
  app.controller(
    'MainCtrl',
    function ($scope) {
      $scope.showFoodDetail = function ($event) {
        $('#foodDetailModal').modal();
      };
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
      $scope.upvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'up';
      };
      $scope.downvote = function ($event, itemId) {
        $event.stopImmediatePropagation();
        getItemById(itemId).vote = 'down';
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
          vote: 'up'
        },
        {
          id: 2,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'B',
          upvotes: '95%',
          downvotes: '5%',
          vote: 'down'
        },
        {
          id: 3,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'C',
          upvotes: '40%',
          downvotes: '60%'
        },
        {
          id: 4,
          title: 'Pizza',
          location: 'Main Walkway',
          letter: 'D',
          upvotes: '40%',
          downvotes: '60%',
          vote: 'down'
        }
      ];
    }
  );
});