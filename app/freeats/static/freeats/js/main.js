require.config({
  baseUrl: '/static/freeats/js',
  paths: {
    jquery: 'lib/jquery-2.1.4.min',
    angular: 'lib/angular-1.4.5.min',
    bootstrap: 'lib/bootstrap-3.3.5.min'
  },
  shim: {
    jquery: { exports: '$' },
    angular: { exports: 'angular' },
    bootstrap: { deps: ['jquery'] }
  }
});

require([
  'bootstrap',
  'angular',
  'app',
  'MainCtrl'
], function () {
  console.log('Initializing freeats...');
});