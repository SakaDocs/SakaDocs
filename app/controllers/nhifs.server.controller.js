'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    sms = require('./sms.server.controller'),
    Nhif = mongoose.model('Nhif'),
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
 * Create a Nhif card id
 */
exports.create = function(req, res) {
    var storage = cloudinaryStorage({
        cloudinary: Cloudinary,
        folder: 'insurance_cards',
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
                    cardNumber: idDetails.cardNumber,
                    locationFound: idDetails.location,
                    companyName: idDetails.companyName,
                    finderNumber: idDetails.finderNumber

                }
            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    cardNumber: idDetails.cardNumber,
                    locationFound: idDetails.location,
                    companyName: idDetails.companyName,
                    finderNumber: idDetails.finderNumber,
                    idPhoto: req.file.secure_url
                };
                var nhif = new Nhif(id);
                nhif.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        Alert.find({ "docType": "nhif" }).exec(function(err, alerts) {
                            if (err) {
                                console.log("Unable to find alerts for nhif");
                            } else {

                                alerts.forEach(function(alert) {
                                    var message = "Hi, " + id["fullNames"].toUpperCase() +  " Your " + alert.details["companyName"].toUpperCase() + " Insurance card has been posted on SakaDocs.Visit www.sakadocs.co.ke to claim it.";
                                    if (id["companyName"].toUpperCase() === alert.details["companyName"].toUpperCase() && id["cardNumber"].toUpperCase() === alert.details["cardNumber"].toUpperCase()) {
                                        sms.sendMessage(alert.details["mobileNumber"], message, req, res);
                                    }
                                })
                            };

                        })
                        res.status(201).json({
                            success: true,
                            message: 'You have uploaded Insurance card successfully!!'
                        });
                    }
                });
            }
        }
    })
};

/**
 * Show the current Nhif card
 */

exports.read = function(req, res) {
    Nhif.findById(req.params.id).exec(function(err, id) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!id) {
                return res.status(404).send({
                    message: 'Nhif card  not found'
                });
            }
            res.json(id);
        }
    });
};


exports.nhifAlert = function(req, res) {
    var alert = new Alert({
        docType: "nhif",
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


exports.mynhifs = function(req, res) {

    var fN = req.params.finderNumber;
    Nhif.find({ "finderNumber": fN }).exec(function(err, ids) {
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
 * Update a Nhif card
 */
exports.update = function(req, res) {

};

/**
 * Delete an Nhif card
 */
exports.delete = function(req, res) {

};

/**
 * List of Nhif cards
 */
exports.list = function(req, res) {
    Nhif.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};