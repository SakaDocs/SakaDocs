'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    National = mongoose.model('National'),
    _ = require('lodash');

/**
 * Create(post) a National Id
 */
exports.create = function(req, res) {
	var national = new National(req.body);

	national.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(201).json(national);
		}
	});
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	National.findById(req.params.nationalId).exec(function(err, id) {
		if (err) {
	      return res.status(400).send({
	          message: errorHandler.getErrorMessage(err)
	      });
      } else {
         if (!id) {
				return res.status(404).send({
  					message: 'National ID not found'
  				});
			}
			res.json(id);
      }
	});
};

/**
 * Update a Category
 */
exports.update = function(req, res) {

};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {

};

/**
 * List of Categories
 */
exports.list = function(req, res) {
    National.find().exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids);
        }
    });
};