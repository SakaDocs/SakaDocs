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
	institutionName: {
		type: String, 
		trim: true
	},
	fullNames: {
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
    },
	 idPhoto: {
        type: String,
        trim: true
    },
	claimed: {
        type: Boolean,
        default: false

    }
});

mongoose.model('Certificate', CertificateSchema);