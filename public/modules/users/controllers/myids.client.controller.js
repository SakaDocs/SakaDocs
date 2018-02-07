'use strict';

angular.module('users').controller('MyidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.show = false;
            $scope.credentials = {};
            $scope.find = function() {
                $http.get('/nationalids/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);