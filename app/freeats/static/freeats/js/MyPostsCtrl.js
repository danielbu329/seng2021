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
      /*eventBus.on('mapLoaded', function () {
        $rootScope.mapLoaded = true;
      });*/
      eventBus.emit('showMyPostsCtrl');

      $scope.myPosts = [
        {
          id: 1,
          title: 'My post 1223123',
          location: 'Main Walkway',
          description: 'Here is some foodasasdkjhasdkjhasdkjhasdkjh'
        },
        {
          id: 2,
          title: 'My post 2',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 3,
          title: 'My post 3',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 4,
          title: 'My post 4',
          location: 'Main Walkway',
          description: 'Here is some food'
        },
        {
          id: 5,
          title: 'My post 5',
          location: 'Main Walkway',
          description: 'Here is some food'
        }
      ];

      $($('.map')[0]).fadeTo(400, 0, function () {
        $($('.map')[0]).css({ display: 'none' });
      });

      $('.top-right').fadeTo(400, 1);
      $('.my-posts-header').fadeTo(400, 1);
      $('.my-posts-content').fadeTo(400, 1);
    }
  );
});