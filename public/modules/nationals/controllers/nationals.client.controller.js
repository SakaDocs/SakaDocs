'use strict';

angular.module('nationals').controller('NationalsController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
    	              
    	$scope.find = function() {
            $http.get('/nationalids').success(function(res) {
            	$scope.ids = res;
            }).error(function(response) {
                $scope.error = res.message;
            });
        }
        

    }
]);
