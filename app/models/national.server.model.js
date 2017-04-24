'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * National Schema
 */
var NationalSchema = new Schema({
	fullNames: {
		type: String, 
		trim: true
	},
	idNumber: {
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

mongoose.model('National', NationalSchema);