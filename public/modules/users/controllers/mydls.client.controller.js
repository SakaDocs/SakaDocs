'use strict';

angular.module('users').controller('MydlsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.show = false;
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/dls/' + $scope.authentication.user.username).success(function(res) {
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
                        $scope.credentials.docType = "dl";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);