'use strict';

angular.module('students').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post('/poststudentid', fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);

