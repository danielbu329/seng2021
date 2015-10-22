define('appConfig', [
  'app'
],
function (app) {
  app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/static/freeats/home.html',
        controller: 'HomeCtrl'
      })
      .when('/me', {
        templateUrl: '/static/freeats/myposts.html',
        controller: 'MyPostsCtrl'
      })
      .when('/admin', {
        templateUrl: '/static/freeats/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({ 'redirectTo': '/' });
  });
});