'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    National = mongoose.model('National'),
    multer = require('multer'),
    _ = require('lodash');


/**
 * Create(post) a National Id
 */
exports.create = function(req, res) {

    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/modules/uploads/images/ids')
        },
        filename: function(req, file, cb) {
            if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                var err = new Error();
                err.code = 'filetype';
                return cb(err);
            } else {
                cb(null, Date.now() + '_' + file.originalname);
            }

        }
    })
    var upload = multer({
        storage: storage,
        limits: { fileSize: 10000000 }

    }).single('idphoto');

    upload(req, res, function(err) {
            console.log(req.body);
            console.log(req.file);
            if (err) {
                console.log(err);
                if (err.code === 'LIMIT_FILE_SIZE') {
                    res.json({
                        success: false,
                        message: 'Image size is too large, maximum limit is 10mb'
                    });
                } else if (err.code === 'Imagetype') {
                    res.json({
                        success: false,
                        message: 'Image type is invalid. Must be .png/.jpg/.jpeg'
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Image was not uploaded'
                    });
                }
            } else {
                if (!req.file) {
                    res.json({
                        success: false,
                        message: 'No Image was uploaded'
                    });
                } else {
                	var idDetails = JSON.parse(req.body.iddetails);
                	console.log(idDetails);
                    var id = {
                        fullNames: idDetails.fullNames,
                        idNumber: idDetails.idNumber,
                        locationFound: idDetails.location,
                        finderNumber: idDetails.finderNumber,
                        idPhoto: "modules/uploads/images/ids/" + req.file.filename
                    };
                    console.log(id);
                    var national = new National(id);
                    national.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.status(201).json({
                        success: true,
                        message: 'You have uploaded Id successfully!!'
                    });
                        }
                    });
                    
                }
            }
        })
};

/**
 * Show the current ID
 */
exports.read = function(req, res) {
    National.findById(req.params.id).exec(function(err, id) {
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
    National.find({"claimed": false}).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};
