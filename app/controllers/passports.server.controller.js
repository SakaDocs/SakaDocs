'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Passport = mongoose.model('Passport'),
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
 * Create a Passport id
 */
exports.create = function(req, res) {
    var storage = cloudinaryStorage({
        cloudinary: Cloudinary,
        folder: 'passports',
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
                    passportNumber: idDetails.passportNumber,
                    locationFound: idDetails.location,
                    country: idDetails.country,
                    finderNumber: idDetails.finderNumber

                }
            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    passportNumber: idDetails.passportNumber,
                    locationFound: idDetails.location,
                    country: idDetails.country,
                    finderNumber: idDetails.finderNumber,
                    idPhoto: req.file.secure_url
                };
                var passport = new Passport(id);
                passport.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.status(201).json({
                            success: true,
                            message: 'You have uploaded Passport successfully!!'
                        });
                    }
                });
                Alert.find({ "docType": "passport" }).exec(function(err, alerts) {
                    if (err) {
                        console.log("Unable to find alerts for passport")
                    } else {
                        // alerts.forEach(alert, function (alert) {
                        console.log(alerts);
                        // });
                    }
                });

            }
        }
    })
};

/**
 * Show the current Passport
 */

exports.read = function(req, res) {
    Passport.findById(req.params.id).exec(function(err, id) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!id) {
                return res.status(404).send({
                    message: 'Passport  not found'
                });
            }
            res.json(id);
        }
    });
};

exports.passportAlert = function(req, res) {
    var alert = new Alert({
        docType: "passport",
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



exports.mypassports = function(req, res) {

    var fN = req.params.finderNumber;
    Passport.find({ "finderNumber": fN }).exec(function(err, ids) {
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
 * Update a Passport
 */
exports.update = function(req, res) {

};

/**
 * Delete an Passport
 */
exports.delete = function(req, res) {

};

/**
 * List of Passports
 */
exports.list = function(req, res) {
    Passport.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};