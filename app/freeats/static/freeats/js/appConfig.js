define('appConfig', [
  'app'
],
function (app) {
  console.log('config stuff', app.config);
  app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
    /*$routeProvider
      .when('/freeats/me', {
        templateUrl: '/freeats/index.html',
        controller: 'MainCtrl'
      });*/
  });
});