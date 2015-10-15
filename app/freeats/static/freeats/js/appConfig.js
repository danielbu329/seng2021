define('appConfig', [
  'app'
],
function (app) {
  app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/freeats', {
        templateUrl: '/static/freeats/home.html',
        controller: 'HomeCtrl'
      })
      .when('/freeats/me', {
        templateUrl: '/static/freeats/myposts.html',
        controller: 'MyPostsCtrl'
      })
      .otherwise({ 'redirectTo': '/freeats' });
  });
});