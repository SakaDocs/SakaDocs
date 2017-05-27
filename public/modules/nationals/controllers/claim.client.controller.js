'use strict';

angular.module('nationals').controller('ClaimController', ['$scope', '$location', 'Authentication',
    function($scope, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
            $scope.claim = function() {
                
                if ($scope.authentication.user.accountBalance < 200) {
                	
                } else {
                    $scope.message = "claim id";
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
