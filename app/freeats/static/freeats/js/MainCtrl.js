define('MainCtrl', [
  'jquery',
  'app'
],
function ($, app) {
  app.controller(
    'MainCtrl',
    function ($scope) {
      $scope.showFoodDetail = function () {
        $('#foodDetail').modal();
      };
    }
  );
});