'use strict';

//Setting up route
angular.module('blogs').config(['$stateProvider',
	function($stateProvider) {
		// Blogs state routing
		$stateProvider.
		state('blog/howtoclaimadoc', {
			url: 'blog/howtoclaimadoc',
			templateUrl: 'modules/blogs/views/howtoclaimadoc.client.view.html'
		}).
		state('blog/howtopostadoc', {
			url: '/blog/howtopostadoc',
			templateUrl: 'modules/blogs/views/howtopostadoc.client.view.html'
		});
	}
]);