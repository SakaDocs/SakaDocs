'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Alerts Schema
 */
var AlertSchema = new Schema({
    docType: { 
    	type: String, 
    	trim: true 
    },
    details: { 
    	type:[{
            type: String
        }], 
    	trim: true 
    }   
});

mongoose.model('Alert', AlertSchema);
