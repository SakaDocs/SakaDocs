'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    National = mongoose.model('National'),
    _ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
exports.doctype = function(req, res) {
	
};
exports.mpesapayment = function(req, res) {
	console.log(req.body);
	// if (req.body.accountNumber.charAt(0)) {}
};