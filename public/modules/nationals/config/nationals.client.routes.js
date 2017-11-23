'use strict';

//Setting up route
angular.module('nationals').config(['$stateProvider', 
	function($stateProvider) {
		// Nationals state routing
		$stateProvider.
		state('claimid', {
			url: '/claimid/:id',
			templateUrl: 'modules/nationals/views/claimid.client.view.html'
		}).
		state('postid', {
			url: '/postid',
			templateUrl: 'modules/nationals/views/postid.client.view.html'
		}).
		state('nationals', {
			url: '/nationals',
			templateUrl: 'modules/nationals/views/nationals.client.view.html'
		});
	}
]);