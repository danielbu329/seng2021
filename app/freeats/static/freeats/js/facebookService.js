define('facebookService', [
  'app',
  'facebook'
],
function (app, FB) {
  app.factory(
    'facebookService',
    function ($rootScope) {
      var facebookService = {};
      facebookService.init = function () {
        FB.init({
          appId: '1633260020259993',
          version: 'v2.4'
        });
      };
      $rootScope.getFacebookLoginStatus = function (cb) {
        FB.getLoginStatus(function (res) {
          // Force angular to re-evaluate
          setTimeout(function () {
            $rootScope.$apply(function () {
              if (res.status == 'connected') {
                // Logged into Freeats and Facebook
                $rootScope.loggedIn = true;
                $rootScope.fbAccessToken = res.authResponse.accessToken;
                $rootScope.fbUserId = res.authResponse.userID;
                if (typeof cb == 'function') cb();
              } else if (res.status == 'not_authorized') {
                // Not logged into Freeats, but is logged into Facebook
                $rootScope.loggedIn = false;
              } else {
                // Not logged into Freeats nor Facebook
              }
            });
          });
        });
      };
      $rootScope.loginFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = true;
            $rootScope.fbAccessToken = res.authResponse.accessToken;
            $rootScope.fbUserId = res.authResponse.userID;
          } else {
            // Not logged into Freeats nor Facebook
            FB.login(function (res) {
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
      $rootScope.logoutFacebook = function () {
        FB.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            // Logged into Freeats and Facebook
            $rootScope.loggedIn = false;
            FB.logout(function (res) {
            });
          }
        });
      };
      return facebookService;
    }
  );
});