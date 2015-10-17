require.config({
  baseUrl: '/static/freeats/js',
  paths: {
    jquery: 'lib/jquery-2.1.4.min',
    angular: 'lib/angular-1.4.5.min',
    ngRoute: 'lib/angular-route-1.4.5.min',
    ngResource: 'lib/angular-resource-1.4.5.min',
    bootstrap: 'lib/bootstrap-3.3.5.min',
    async: 'lib/requirejs-plugins/async',
    gmaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDd2PVlQfUYDgf8vwyKH2tDaXkilXqPhU',
    facebook: '//connect.facebook.net/en_US/sdk',
    moment: 'lib/moment-2.10.6.min',
    'moment-timezone-data': 'lib/moment-timezone-with-data.min'
  },
  shim: {
    jquery: { exports: '$' },
    angular: { exports: 'angular' },
    ngRoute: { deps: ['angular'] },
    ngResource: { deps: ['angular'] },
    bootstrap: { deps: ['jquery'] },
    facebook: { exports: 'FB' }
  },
  config: {
    moment: { noGlobal: true }
  }
});

require([
  'bootstrap',
  'angular',
  'app',
  'HomeCtrl',
  'MyPostsCtrl',
  'appConfig',
  'map'
], function () {
  console.info('Initializing freeats...');
  angular.bootstrap(document, ['freeats']);
});