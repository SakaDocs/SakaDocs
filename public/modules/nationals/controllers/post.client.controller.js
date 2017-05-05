'use strict';

angular.module('nationals').controller('PostController', ['$scope', '$http', '$location', 'Authentication',

function($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    if ($scope.authentication.user) {
        $scope.post = function() {
            $http.post('/nationalids', $scope.id).success(function(response) {
                $scope.sccs = "successfully posted id";
                $location.path('nationals');
            }).error(function(response) {
                $scope.err = response.message;
            });
        }
} else {
    $location.path('signin');
    $scope.err = "Please sign in or Create an account to continue";
}
}]);
