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
                $http.get('/dls/' + $scope.authentication.user.phoneNumber).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            };
            $scope.toggle = function () {
                 $scope.show = true;
                 console.log(show);
            }
        } else {
            $location.path('/signin');
        }


    }
]);