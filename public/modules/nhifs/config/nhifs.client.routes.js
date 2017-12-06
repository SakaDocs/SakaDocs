'use strict';

//Setting up route
angular.module('nhifs').config(['$stateProvider',
	function($stateProvider) {
		// Nhifs state routing
		$stateProvider.
		state('claimnhif', {
			url: '/claimnhif/:id',
			templateUrl: 'modules/nhifs/views/claimnhif.client.view.html'
		}).
		state('postnhif', {
			url: '/postnhif',
			templateUrl: 'modules/nhifs/views/postnhif.client.view.html'
		}).
		state('nhifs', {
			url: '/nhifs',
			templateUrl: 'modules/nhifs/views/nhifs.client.view.html'
		});
	}
]);