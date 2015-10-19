define('MyPostsCtrl', [
  'jquery',
  'app',
  'eventBus',
  'facebookService'
],
function ($, app, eventBus, facebookService) {
  app.controller(
    'MyPostsCtrl',
    function ($rootScope, $scope, $resource, $location, facebookService) {
      console.log('MyPostsCtrl');
      facebookService.init();
      $rootScope.currentView = 'myposts';
      $rootScope.loggedIn = false;

      eventBus.on('mapLoaded', function () {
        $rootScope.mapLoaded = true;
      });

      $rootScope.getFacebookLoginStatus(function () {
        $scope.updatePostList();
      });

      eventBus.emit('showMyPostsCtrl');

      var getItemById = function (id) {
        var item = null;
        for (i in $scope.myPosts) {
          var j = $scope.myPosts[i];
          if (j.id == id) {
            item = j;
            break;
          }
        }
        return item;
      }
      $scope.editPost = function (postId) {
        $scope.post = getItemById(postId);
        $('#editPostModal').modal();
      };
      var Food = $resource('/freeats/food',  null, {
        'update': { method: 'PUT' }
      });
      $scope.updatePost = function () {
        var post = angular.copy($scope.post);
        post.user_id = $rootScope.fbUserId;
        post.access_token = $rootScope.fbAccessToken;
        console.log(post);
        // Need to validate post data still
        Food.update(post, function () {
          console.info('Post saved');
          $('#editPostModal').modal('hide');
          $scope.post = {};
          $scope.updatePostList();
        });
      };
      $scope.updatePostList = function () {
        var MyPost = $resource('/freeats/myposts');
        var params = {
          user_id: $rootScope.fbUserId,
          access_token: $rootScope.fbAccessToken
        };
        MyPost.query(params, function (results) {
          $scope.myPosts = [];
          for (var i = 0; i < results.length; i++) {
            var post = angular.copy(results[i]);
            $scope.myPosts.push(post);
          }
        });
      }

      /*$scope.myPosts = [
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
      ];*/

      $($('.map')[0]).fadeTo(400, 0, function () {
        $($('.map')[0]).css({ display: 'none' });
      });

      $('.top-right').fadeTo(400, 1);
      $('.my-posts-header').fadeTo(400, 1);
      $('.my-posts-content').fadeTo(400, 1);
    }
  );
});