'use strict';

angular.module('core').controller('PricingplanController', ['$scope', 'Authentication', '$window',
    function($scope) {
        // Controller Logic
        // ...
        $scope.authentication = Authentication;

        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
    }
]);