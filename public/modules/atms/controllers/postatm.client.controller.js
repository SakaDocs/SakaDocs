'use strict';

angular.module('atms').controller('PostatmController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice) {
       $scope.authentication = Authentication;
       // check if user is logged in
       if ($scope.authentication.user) {
        $scope.file = {};
        $scope.Submit = function() {
            $scope.uploading = true;
            // set the users number as finderNumber 
            $scope.id.finderNumber = $scope.authentication.user.phoneNumber;
            var url = '/postatm'
           Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                if (data.data.success) {
                    $scope.alert = 'alert alert-success';
                    $scope.message = data.data.message;
                    $scope.file = {};
                    $scope.uploading = false;
                    $interval(function () {
                        $location.path('/atms')
                    }, 2000, 1,false);
                    
                } else {
                    $scope.uploading = false;
                    $scope.alert = 'alert alert-danger';
                    $scope.message = data.data.message;
                    $scope.file = {};
                }
            })
        }
        $scope.photoChanged = function(files) {
            if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                $scope.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.thumbnail = {};
                        $scope.thumbnail.dataUrl = e.target.result;
                        $scope.uploading = false;
                        $scope.message = false;
                    });
                }

            } else {
                $scope.thumbnail = {};
                $scope.message = false;
            }
        }
    }else{
    	$location.path('/signin');
    }
    }
]);
