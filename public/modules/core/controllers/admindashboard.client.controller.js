'use strict';

angular.module('core').controller('AdmindashboardController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user && $scope.authentication.user["roles"][0] === "admin") {
            $scope.countUsers = function() {

                $http.get('/countusers').success(function(res) {
                    $scope.usersCount = res["usersCount"]
                }).error(function(res) {
                    $scope.error = res.message;
                });
                $http.get('/countnationals').success(function(res) {
                    $scope.nationalsCount = res["nationalsCount"]
                    console.log($scope.nationalsCount);
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
        } else {
            $location.path('/signin');
        }
    }
]);