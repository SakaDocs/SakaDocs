'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Atm Schema
 */
var AtmSchema = new Schema({
	bank: {
		type: String, 
		trim: true
	},
	type: {
		type: String, 
		trim: true
	},
	Name: {
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
	}
	// store photo
});

mongoose.model('Atm', AtmSchema);