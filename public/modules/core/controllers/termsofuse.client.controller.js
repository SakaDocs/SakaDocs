'use strict';

angular.module('core').controller('TermsofuseController', ['$scope', 'Authentication', '$window',
    function($scope) {

        $scope.authentication = Authentication;

        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
    }
]);