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
        }else{
            $location.path('/signin');
        }    
    }
]);
