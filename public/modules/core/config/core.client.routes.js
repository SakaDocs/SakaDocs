'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('dl', {
			url: '/dl',
			templateUrl: 'modules/dls/views/dls.client.view.html'
		}).
		state('passport', {
			url: '/passport',
			templateUrl: 'modules/passports/views/passports.client.view.html'
		}).
		state('certificate', {
			url: '/certificate',
			templateUrl: 'modules/certificates/views/certificates.client.view.html'
		}).
		state('nhifcard', {
			url: '/nhifcard',
			templateUrl: 'modules/nhifs/views/nhifs.client.view.html'
		}).
		state('staffid', {
			url: '/staffid',
			templateUrl: 'modules/staffs/views/staffids.client.view.html'
		}).
		state('studentid', {
			url: '/studentid',
			templateUrl: 'modules/students/views/studentids.client.view.html'
		}).
		state('pricingplan', {
			url: '/pricingplan',
			templateUrl: 'modules/core/views/pricingplan.client.view.html'
		}).
		state('termsofuse', {
			url: '/termsofuse',
			templateUrl: 'modules/core/views/termsofuse.client.view.html'
		}).
		state('payment', {
			url: '/payment',
			templateUrl: 'modules/core/views/payment.client.view.html'
		}).
		state('footer', {
			url: '/footer',
			templateUrl: 'modules/core/views/footer.client.view.html'
		}).
		state('atm', {
			url: '/atm',
			templateUrl: 'modules/atms/views/atms.client.view.html'
		}).
		state('national', {
			url: '/national',
			templateUrl: 'modules/nationals/views/nationals.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);