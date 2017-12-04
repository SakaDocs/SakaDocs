'use strict';

//Setting up route
angular.module('students').config(['$stateProvider',
	function($stateProvider) {
		// Students state routing
		$stateProvider.
		state('claimstudentid', {
			url: '/claimstudentid/:id',
			templateUrl: 'modules/students/views/claimstudentid.client.view.html'
		}).
		state('poststudentid', {
			url: '/poststudentid',
			templateUrl: 'modules/students/views/poststudentid.client.view.html'
		}).
		state('studentids', {
			url: '/studentids',
			templateUrl: 'modules/students/views/studentids.client.view.html'
		});
	}
]);