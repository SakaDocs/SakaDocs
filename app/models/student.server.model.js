'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
    fullNames: { 
    	type: String, 
    	trim: true 
    },
    admissionNumber: { 
    	type: String, 
    	trim: true 
    },
    schoolName: { 
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
    claimed: {
        type: Boolean,
        default: false

    }
    // store photo
});

mongoose.model('Student', StudentSchema);
