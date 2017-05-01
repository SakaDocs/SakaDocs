'use strict';

//Setting up route
angular.module('atms').config(['$stateProvider',
	function($stateProvider) {
		// Atms state routing
		$stateProvider.
		state('atms', {
			url: '/atms',
			templateUrl: 'modules/atms/views/atms.client.view.html'
		});
	}
]);