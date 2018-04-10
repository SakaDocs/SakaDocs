'use strict';

//Setting up route
angular.module('blogs').config(['$stateProvider',
	function($stateProvider) {
		// Blogs state routing
		$stateProvider.
		state('blog/howtoclaimpayment', {
			url: '/blog/howtoclaimpayment',
			templateUrl: 'modules/blogs/views/howtoclaimpayment.client.view.html'
		}).
		state('blog/howtoclaimadoc', {
			url: '/blog/howtoclaimadoc',
			templateUrl: 'modules/blogs/views/howtoclaimadoc.client.view.html'
		}).
		state('blog/howtopostadoc', {
			url: '/blog/howtopostadoc',
			templateUrl: 'modules/blogs/views/howtopostadoc.client.view.html'
		});
	}
]);