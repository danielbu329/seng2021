require.config({
  baseUrl: '/static/freeats/js',
  paths: {
    jquery: 'lib/jquery-2.1.20.min',
    angular: 'lib/angular-1.4.5.min'
  },
  shim: {
    jquery: { exports: '$' },
    angular: { exports: 'angular' }
  }
});

require([
  'angular',
  'app',
  'MainCtrl'
], function () {

});