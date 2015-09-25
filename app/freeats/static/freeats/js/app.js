define('app', [
  'angular',
  'ngResource'
],
function (angular) {
  var app = angular.module('freeats', ['ngResource']);
  return app;
});