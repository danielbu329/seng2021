define('app', [
  'angular',
  'ngRoute',
  'ngResource'
],
function (angular) {
  var app = angular.module('freeats', ['ngRoute', 'ngResource']);
  return app;
});