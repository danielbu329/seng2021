define('MainCtrl', [
  'app'
],
function (app) {
  app.controller(
    'MainCtrl',
    function ($scope) {
      $scope.hello = function () {
        console.log('Hello, world!');
      };
    }
  );
});