'use strict';

//Setting up route
angular.module('atms').config(['$stateProvider',
	function($stateProvider) {
		// Atms state routing
		$stateProvider.
		state('claimatm', {
			url: '/claimatm/:id',
			templateUrl: 'modules/atms/views/claimatm.client.view.html'
		}).
		state('postatm', {
			url: '/postatm',
			templateUrl: 'modules/atms/views/postatm.client.view.html'
		}).
		state('atms', {
			url: '/atms',
			templateUrl: 'modules/atms/views/atms.client.view.html'
		});
	}
]);