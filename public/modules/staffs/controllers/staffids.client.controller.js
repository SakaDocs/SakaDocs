'use strict';

angular.module('staffs').controller('StaffidsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/staffids').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.staffId.mobileNumber = Authentication.user.username;
                $http.post('/staffidalert', $scope.staffId).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.staffId.companyName = "";
                    $scope.staffId.fullName = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);