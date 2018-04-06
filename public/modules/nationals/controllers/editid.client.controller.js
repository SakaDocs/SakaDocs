'use strict';

angular.module('nationals').controller('EditidController', ['$scope', '$window', 'Authentication', '$http', '$stateParams', '$location',
    function($scope, $window, Authentication, $http, $stateParams, $location) {
        $scope.authentication = Authentication.user;
        if ($window.sessionStorage['user']) {
            $scope.authentication = JSON.parse($window.sessionStorage['user']);
        }
        // check if user is signed in
        if ($scope.authentication.user) {
            $scope.id = {};
            // fetch document using isValid
            $scope.getId = function() {
                $http.get('/nationalid/' + $stateParams.id).success(function(res) {
                    $scope.id = res;
                    console.log($scope.id);
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            console.log($scope.id);
            // Update a user profile
            $scope.updateDocument = function(isValid) {
                if (isValid) {
                    $scope.success = $scope.error = null;
                    var user = new Users($scope.user);

                    user.$update(function(response) {
                        $scope.success = true;
                        Authentication.user = response;
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                } else {
                    $scope.submitted = true;
                }
            };
        } else {
            $location.path('/signin');
        }
    }
]);