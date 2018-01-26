'use strict';

angular.module('users').controller('ClaimdlpaymentController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
        if ($scope.authentication.user) {
            $scope.claim = function() {
                var url = '/dl/';
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get(url + $stateParams.id).success(function(res) {
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