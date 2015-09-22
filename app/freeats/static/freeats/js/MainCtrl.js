define('MainCtrl', [
  'jquery',
  'app'
],
function ($, app) {
  app.controller(
    'MainCtrl',
    function ($scope) {
      $scope.showFoodDetail = function () {
        $('#foodDetailModal').modal();
      };
      $scope.createPost = function () {
        $('#newPostModal').modal();
      }
    }
  );
});