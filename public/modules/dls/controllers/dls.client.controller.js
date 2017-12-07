'use strict';

angular.module('dls').controller('DlsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {

        $scope.find = function() {
            $http.get('/dls').success(function(res) {
                $scope.ids = res;
                 $scope.alert = 'alert alert-danger';
            }).error(function(res) {
                $scope.error = res.message;
            });
        }
       
    }
]);
