'use strict';

angular.module('nationals').controller('ClaimController', ['$scope', '$http', '$location', 'Authentication', '$stateParams',
    function($scope, $http, $location, Authentication, $stateParams) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
            $scope.claim = function() {
                // $http.get('/nationalids/$stateParams.id').success(function(res) {
                //     $scope.ids = res;
                // }).error(function(res) {
                //     $scope.error = res.message;
                // });

                if ($scope.authentication.user.accountBalance < 200) {
                    $scope.message = "Recharge account";
                } else {
                    $scope.message = "claim id";
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);