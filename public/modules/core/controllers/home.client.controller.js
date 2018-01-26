'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$window', '$http', '$location',
    function($scope, Authentication, $window, $http, $location) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
        $scope.signout = function() {
            $http.get('/auth/signout').success(function(res) {
                $window.sessionStorage["user"] = null;
                $location.path('/signup');
            }).error(function(res) {
            });
        }
    }
]);