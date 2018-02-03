'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    sms = require('./sms.server.controller'),
    Dl = mongoose.model('Dl'),
    Alert = mongoose.model('Alert'),
    multer = require('multer'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    Cloudinary = require('cloudinary'),
    _ = require('lodash');



Cloudinary.config({

    cloud_name: 'swiz',
    api_key: '842284685168382',
    api_secret: '8o09iM4gWFmNDgDfMi-BystZkEI',

});

/**
 * Create a Dl 
 */
exports.create = function(req, res) {
    var storage = cloudinaryStorage({
        cloudinary: Cloudinary,
        folder: 'Dls',
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
                    finderNumber: idDetails.finderNumber,
                    locationFound: idDetails.location

                }
            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    finderNumber: idDetails.finderNumber,
                    locationFound: idDetails.location,
                    idPhoto: req.file.secure_url
                };
                var dl = new Dl(id);
                dl.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        Alert.find({ "docType": "dl" }).exec(function(err, alerts) {
                            if (err) {
                                console.log("Unable to find alerts for DL");
                            } else {
                                alerts.forEach(function(alert) {
                                    var message = "Hi, " +  alert.details["fullNames"].toUpperCase() + " Your driving license has been posted on SakaDocs. Visit www.sakadocs.co.ke to claim it.";
                                    if (id["fullNames"].toUpperCase() === alert.details["fullNames"].toUpperCase()) {
                                        sms.sendMessage(alert.details["mobileNumber"], message, req, res);
                                    }
                                })
                            };

                        })
                        res.status(201).json({
                            success: true,
                            message: 'You have uploaded Driving license successfully!!'
                        });
                    }
                });

            }
        }
    })
};

/**
 * Show the current Dl
 */

exports.read = function(req, res) {
    Dl.findById(req.params.id).exec(function(err, id) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!id) {
                return res.status(404).send({
                    message: 'Dl ID not found'
                });
            }
            res.json(id);
        }
    });
};


exports.dlAlert = function(req, res) {
    var alert = new Alert({
        docType: "dl",
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


exports.mydls = function(req, res) {

    var fN = req.params.finderNumber;
    Dl.find({ "finderNumber": fN }).exec(function(err, ids) {
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
 * Update a Dl
 */
exports.update = function(req, res) {

};

/**
 * Delete an Dl
 */
exports.delete = function(req, res) {

};

/**
 * List of Dls
 */
exports.list = function(req, res) {
    Dl.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};