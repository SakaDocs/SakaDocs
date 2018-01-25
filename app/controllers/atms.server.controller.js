'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Atm = mongoose.model('Atm'),
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
 * Create a Student id
 */
exports.create = function(req, res) {
    var storage = cloudinaryStorage({
        cloudinary: Cloudinary,
        folder: 'atm_cards',
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
                    bankName: idDetails.bankName,
                    cardType: idDetails.cardType,
                    schoolName: idDetails.schoolName,
                    finderNumber: idDetails.finderNumber,
                    locationFound: idDetails.location

                }
            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    bankName: idDetails.bankName,
                    cardType: idDetails.cardType,
                    schoolName: idDetails.schoolName,
                    finderNumber: idDetails.finderNumber,
                    locationFound: idDetails.location,
                    idPhoto: req.file.secure_url
                };
                var atm = new Atm(id);
                atm.save(function(err) {
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

                Alert.find({ "docType": "atm" }).exec(function(err, alerts) {
                    if (err) {
                        console.log("Unable to find alerts for atm")
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
 * Show the current atm
 */

exports.read = function(req, res) {
    Atm.findById(req.params.id).exec(function(err, id) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!id) {
                return res.status(404).send({
                    message: 'ATM not found'
                });
            }
            res.json(id);
        }
    });
};

exports.atmAlert = function(req, res) {
    var alert = new Alert({
        docType: "atm",
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

exports.myatms = function(req, res) {

    var fN = req.params.finderNumber;
    Atm.find({ "finderNumber": fN }).exec(function(err, ids) {
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
 * Update a Student
 */
exports.update = function(req, res) {

};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {

};

/**
 * List of Students
 */
exports.list = function(req, res) {
    Atm.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};