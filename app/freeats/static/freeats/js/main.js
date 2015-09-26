require.config({
  baseUrl: '/static/freeats/js',
  paths: {
    jquery: 'lib/jquery-2.1.4.min',
    angular: 'lib/angular-1.4.5.min',
    ngResource: 'lib/angular-resource-1.4.5.min',
    bootstrap: 'lib/bootstrap-3.3.5.min',
    async: 'lib/requirejs-plugins/async',
    gmaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDd2PVlQfUYDgf8vwyKH2tDaXkilXqPhU'
  },
  shim: {
    jquery: { exports: '$' },
    angular: { exports: 'angular' },
    ngResource: { deps: ['angular'] },
    bootstrap: { deps: ['jquery'] }
  }
});

require([
  'map',
  'bootstrap',
  'angular',
  'app',
  'MainCtrl'
], function () {
  console.info('Initializing freeats...');
  angular.bootstrap(document, ['freeats']);
});