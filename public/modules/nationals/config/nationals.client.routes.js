'use strict';

//Setting up route
angular.module('nationals').config(['$stateProvider',
	function($stateProvider) {
		// Nationals state routing
		$stateProvider.
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