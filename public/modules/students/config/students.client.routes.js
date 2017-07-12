'use strict';

//Setting up route
angular.module('students').config(['$stateProvider',
	function($stateProvider) {
		// Students state routing
		$stateProvider.
		state('studentids', {
			url: '/studentids',
			templateUrl: 'modules/students/views/studentids.client.view.html'
		});
	}
]);