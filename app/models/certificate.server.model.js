'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var generateSequence = function (){
  var result = "";
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for(var i=0;i<3;i++){
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}
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

    },
    sakaDocsCode: {
    	type: String,
    	default: Math.floor(Math.random()*900).toString() + generateSequence()
    },
    accountNumber: {
    	type: String,
    	default: "C" + Math.floor(Math.random()*900).toString() + generateSequence()
    }
});

mongoose.model('Certificate', CertificateSchema);