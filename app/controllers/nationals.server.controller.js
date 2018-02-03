'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    sms = require('./sms.server.controller'),
    National = mongoose.model('National'),
    Alert = mongoose.model('Alert'),
    multer = require('multer'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    Cloudinary = require('cloudinary'),
    _ = require('lodash');

/**
 * Create(post) a National Id
 */

Cloudinary.config({

    cloud_name: 'swiz',
    api_key: '842284685168382',
    api_secret: '8o09iM4gWFmNDgDfMi-BystZkEI',

});

exports.create = function(req, res) {
    var storage = cloudinaryStorage({
        cloudinary: Cloudinary,
        folder: 'national_ids',
        allowedFormats: ['jpg', 'png'],
        filename: function(req, file, cb) {
            if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                var err = new Error();
                err.code = 'filetype';
                return cb(err);
            } else {
                cb(null, Date.now() + '_' + file.originalname);
            }

        }
    });

    var parser = multer({ storage: storage }).single('idphoto');

    parser(req, res, function(err) {
        if (err) {
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
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    idNumber: idDetails.idNumber,
                    locationFound: idDetails.location,
                    finderNumber: idDetails.finderNumber,

                };
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

            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    idNumber: idDetails.idNumber,
                    locationFound: idDetails.location,
                    finderNumber: idDetails.finderNumber,
                    idPhoto: req.file.secure_url
                };
                var national = new National(id);
                national.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        Alert.find({ "docType": "national" }).exec(function(err, alerts) {
                            if (err) {
                                console.log("Unable to find alerts for national ID");
                            } else {

                                alerts.forEach(function(alert) {
                                    var message = "Hi, Your Id number " + alert.details["idNumber"].toUpperCase() + " has been posted on SakaDocs. Visit www.sakadocs.co.ke to claim it.";
                                    if (id["idNumber"].toUpperCase() === alert.details["idNumber"].toUpperCase()) {
                                        sms.sendMessage(alert.details["mobileNumber"], message, req, res);
                                    }
                                })
                            };

                        })
                        res.status(201).json({
                            success: true,
                            message: 'You have uploaded Id successfully!!'
                        });
                    }
                });

            };


        };
    });
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

exports.nationalAlert = function(req, res) {
    var alert = new Alert({
        docType: "national",
        details: req.body
    })

    alert.save(function(err) {
        if (err) {
            console.log(err);
            res.json({ message: "Not sent" })
        } else {
            res.json({ message: "You will be alerted" })
        }
    });

};


exports.myids = function(req, res) {
    var fN = req.params.finderNumber;
    National.find({ "finderNumber": fN }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
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
    National.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};