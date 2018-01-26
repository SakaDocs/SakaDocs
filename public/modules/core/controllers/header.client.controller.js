'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$location', 'Authentication', 'Menus', '$window',
    function($scope, $http, $location, Authentication, Menus, $window) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.search = function() {

            $location.path($scope.docType);
        };
        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
        $scope.signout = function() {
            $http.get('/auth/signout').success(function(res) {
                $window.sessionStorage["user"] = null;
                $location.path('/');
            }).error(function(res) {
                
            });
        }


    }
]);