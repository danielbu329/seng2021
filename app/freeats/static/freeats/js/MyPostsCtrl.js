define('MyPostsCtrl', [
  'jquery',
  'app',
  'eventBus',
  'facebook'
],
function ($, app, eventBus, FB) {
  app.controller(
    'MyPostsCtrl',
    function ($rootScope, $scope, $resource) {
      console.log('MyPostsCtrl');
      $rootScope.currentView = 'myposts';
      $rootScope.loggedIn = false;

      FB.getLoginStatus(function (res) {
        console.log(res);
        // Force angular to re-evaluate
        setTimeout(function () {
          $rootScope.$apply(function () {
            if (res.status == 'connected') {
              // Logged into Freeats and Facebook
              $rootScope.loggedIn = true;
              $rootScope.fbAccessToken = res.authResponse.accessToken;
              $rootScope.fbUserId = res.authResponse.userID;
            } else if (res.status == 'not_authorized') {
              // Not logged into Freeats, but is logged into Facebook
              $rootScope.loggedIn = false;
            } else {
              // Not logged into Freeats nor Facebook
            }
          });
        });
      });

      /*eventBus.on('mapLoaded', function () {
        $rootScope.mapLoaded = true;
      });*/
      eventBus.emit('showMyPostsCtrl');
      $scope.loginFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = true;
            $rootScope.fbAccessToken = res.authResponse.accessToken;
            $rootScope.fbUserId = res.authResponse.userID;
          } else {
            // Not logged into Freeats nor Facebook
            FB.login(function (res) {
              console.log(res);
              setTimeout(function () {
                $rootScope.$apply(function () {
                  if (res.status == 'connected') {
                    $rootScope.loggedIn = true;
                    $rootScope.fbAccessToken = res.authResponse.accessToken;
                    $rootScope.fbUserId = res.authResponse.userID;
                  }
                });
              });
            });
          }
        });
      };
      $scope.logoutFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = false;
            FB.logout(function (res) {
              console.log(res);
            });
          }
        });
      };

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