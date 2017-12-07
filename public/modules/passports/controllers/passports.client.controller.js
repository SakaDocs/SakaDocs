'use strict';

angular.module('passports').controller('PassportsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {

        $scope.find = function() {
            $http.get('/passports').success(function(res) {
                $scope.ids = res;
                 $scope.alert = 'alert alert-danger';
            }).error(function(res) {
                $scope.error = res.message;
            });
        }
       
    }
]);
