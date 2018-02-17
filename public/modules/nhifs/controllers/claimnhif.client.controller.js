'use strict';

angular.module('nhifs').controller('ClaimnhifController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/nhifcard/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);