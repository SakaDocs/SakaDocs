'use strict';

//Setting up route
angular.module('dls').config(['$stateProvider',
	function($stateProvider) {
		// Dls state routing
		$stateProvider.
		state('claimdl', {
			url: '/claimdl/:id',
			templateUrl: 'modules/dls/views/claimdl.client.view.html'
		}).
		state('postdl', {
			url: '/postdl',
			templateUrl: 'modules/dls/views/postdl.client.view.html'
		}).
		state('dls', {
			url: '/dls',
			templateUrl: 'modules/dls/views/dls.client.view.html'
		});
	}
]);