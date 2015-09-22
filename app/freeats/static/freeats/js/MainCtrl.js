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
      $scope.upvote = function ($event) {
        $event.stopImmediatePropagation();
      };
      $scope.downvote = function ($event) {
        $event.stopImmediatePropagation();
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      }
    }
  );
});