'use strict';

//Setting up route
angular.module('passports').config(['$stateProvider',
	function($stateProvider) {
		// Passports state routing
		$stateProvider.
		state('claimpassports', {
			url: '/claimpassport/:id',
			templateUrl: 'modules/passports/views/claimpassports.client.view.html'
		}).
		state('postpassport', {
			url: '/postpassport',
			templateUrl: 'modules/passports/views/postpassport.client.view.html'
		}).
		state('passports', {
			url: '/passports',
			templateUrl: 'modules/passports/views/passports.client.view.html'
		});
	}
]);