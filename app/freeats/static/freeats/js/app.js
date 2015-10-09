define('app', [
  'angular',
  'ngResource'
],
function (angular) {
  var app = angular.module('freeats', ['ngResource']);
  /*app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  });*/
  return app;
});