'use strict';

angular.module('nhifs').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);

