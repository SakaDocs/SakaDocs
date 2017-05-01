'use strict';

//Setting up route
angular.module('nationals').config(['$stateProvider',
	function($stateProvider) {
		// Nationals state routing
		$stateProvider.
		state('nationals', {
			url: '/nationals',
			templateUrl: 'modules/nationals/views/nationals.client.view.html'
		});
	}
]);