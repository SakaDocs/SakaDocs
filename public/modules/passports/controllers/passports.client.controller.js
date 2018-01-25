'use strict';

angular.module('passports').controller('PassportsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/passports').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.passport.mobileNumber = Authentication.user.username;
                $http.post('/passportalert', $scope.passport).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.passport.passportNumber = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);