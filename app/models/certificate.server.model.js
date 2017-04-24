'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Certificate Schema
 */
var CertificateSchema = new Schema({
	awardedBy: {
		type: String, 
		trim: true
	},
	awardedTo: {
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

mongoose.model('Certificate', CertificateSchema);