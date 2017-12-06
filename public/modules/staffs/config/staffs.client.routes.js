'use strict';

//Setting up route
angular.module('staffs').config(['$stateProvider',
	function($stateProvider) {
		// Staffs state routing
		$stateProvider.
		state('claimstaffid', {
			url: '/claimstaffid/:id',
			templateUrl: 'modules/staffs/views/claimstaffid.client.view.html'
		}).
		state('poststaffid', {
			url: '/poststaffid',
			templateUrl: 'modules/staffs/views/poststaffid.client.view.html'
		}).
		state('staffids', {
			url: '/staffids',
			templateUrl: 'modules/staffs/views/staffids.client.view.html'
		});
	}
]);