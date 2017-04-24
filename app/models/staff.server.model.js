'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Staff Schema
 */
var StaffSchema = new Schema({
	fullNames: {
		type: String, 
		trim: true
	},
	jobNumber: {
		type: String, 
		trim: true
	},
	companyName: {
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
	created: {
		type: Date,
		default: Date.now
	}
	// store photo
});

mongoose.model('Staff', StaffSchema);