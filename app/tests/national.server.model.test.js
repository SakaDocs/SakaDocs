'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	National = mongoose.model('National');

/**
 * Unit tests
 */
describe('National Model', function() {

	describe('Saving', function() {
		it('saves new id', function(done) {
            var id = new National({
               fullNames : "Pius Ng'ang'a Kinyanjui",
               idNumber: "27989631",
               locationFound: "Kasarani",
               finderNumber: "+254715753308"
            });
            category.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
        });
	});

});
