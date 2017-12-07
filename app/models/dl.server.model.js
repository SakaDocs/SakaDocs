'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Dl Schema
 */
var DlSchema = new Schema({
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

mongoose.model('Dl', DlSchema);