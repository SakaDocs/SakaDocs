'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Nhif Schema
 */
var NhifSchema = new Schema({
	companyName: {
		type: String, 
		trim: true
	},
	cardNumber: {
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

mongoose.model('Nhif', NhifSchema);