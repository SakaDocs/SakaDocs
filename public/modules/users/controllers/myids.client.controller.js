'use strict';

angular.module('users').controller('MyidsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication) {
            $scope.find = function() {
                $http.get('/nationals/' + $scope.authentication.user.phoneNumber).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
        }else{
        	$location.path('/signin');
        }


    }
]);