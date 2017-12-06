'use strict';

//Setting up route
angular.module('certificates').config(['$stateProvider',
	function($stateProvider) {
		// Certificates state routing
		$stateProvider.
		state('claimcertificate', {
			url: '/claimcertificate/:id',
			templateUrl: 'modules/certificates/views/claimcertificate.client.view.html'
		}).
		state('postcertificate', {
			url: '/postcertificate',
			templateUrl: 'modules/certificates/views/postcertificate.client.view.html'
		}).
		state('certificates', {
			url: '/certificates',
			templateUrl: 'modules/certificates/views/certificates.client.view.html'
		});
	}
]);