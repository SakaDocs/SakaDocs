'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Passport Schema
 */
var PassportSchema = new Schema({
	fullNames: {
		type: String,
		trim: true
	},
	passportNumber: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	},
	locationFound: {
		type: String,
		trim: true
	},
	finderNumber: {
		type: String,
		trim: true
	},

});

mongoose.model('Passport', PassportSchema);