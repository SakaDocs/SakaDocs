'use strict';

angular.module('atms').controller('AtmsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/atms').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.atm.mobileNumber = Authentication.user.username;
                $http.post('/atmalert', $scope.atm).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.atm.fullNames = "";
                    $scope.atm.cardType = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        } else {
            $location.path('/signin');
        }
    }
]);