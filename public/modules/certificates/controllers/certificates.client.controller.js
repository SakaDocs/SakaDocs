'use strict';

angular.module('certificates').controller('CertificatesController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
             $scope.find = function() {
            $http.get('/certificates').success(function(res) {
                $scope.ids = res;
                 $scope.alert = 'alert alert-danger';
            }).error(function(res) {
                $scope.error = res.message;
            });
        }

        $scope.getAlert = function() {
                $scope.certificate.mobileNumber = Authentication.user.username;
                $http.post('/certificatealert', $scope.certificate).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.certificate.institutionName = "";
                    $scope.certificate.fullNames = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        }else{
            $location.path('/signin');
        }    
    }
]);
