'use strict';

angular.module('passports').directive('fileModel', ['$parse',
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// File model directive logic
				// ...

				element.text('this is the fileModel directive');
			}
		};
	}
]);