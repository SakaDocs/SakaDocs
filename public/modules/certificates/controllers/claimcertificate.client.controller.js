'use strict';

angular.module('nationals').controller('ClaimcertificateController', ['$scope', '$http', '$location', 'Authentication', '$stateParams',
    function($scope, $http, $location, Authentication, $stateParams) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) {
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/certificate/' + $stateParams.id).success(function(res) {
                    $scope.id = res;
                }).error(function(res) {
                    $scope.error = res.message;
                });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);