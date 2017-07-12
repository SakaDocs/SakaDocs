'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
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