'use strict';

angular.module('users').controller('AdminsignupController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');
        $scope.signup = function() {

            $http.post('/auth/adminsignup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                // we also save response to sessionStorage
                $window.sessionStorage["user"] = JSON.stringify(response);
                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });

        };
    }
]);
