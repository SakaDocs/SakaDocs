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
    details: {}   
});

mongoose.model('Alert', AlertSchema);