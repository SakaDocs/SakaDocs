'use strict';

angular.module('nhifs').controller('NhifsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/nhifs').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.nhif.mobileNumber = Authentication.user.username;
                $http.post('/nhifalert', $scope.nhif).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.nhif.companyName = "";
                    $scope.nhif.cardNumber = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);