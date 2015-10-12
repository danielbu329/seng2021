define('MyPostsCtrl', [
  'jquery',
  'app',
  'eventBus'
],
function ($, app, eventBus) {
  app.controller(
    'MyPostsCtrl',
    function ($rootScope, $scope, $resource) {
      console.log('MyPostsCtrl');
      $rootScope.currentView = 'myposts';
      eventBus.emit('showMyPostsCtrl');
      $($('.map')[0]).fadeTo(400, 0, function () {
        $($('.map')[0]).css({ display: 'none' });
      });
    }
  );
});