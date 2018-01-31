'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    National = mongoose.model('National'),
    Alert = mongoose.model('Alert'),
    multer = require('multer'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    Cloudinary = require('cloudinary'),
    _ = require('lodash');

// We need this to build our post string
var querystring = require('querystring');
var https = require('https');
// Your login credentials
var username = 'sandbox';
var apikey = '98200eccd2ee9091c41614b786c288d8409368297a5efa257b0b6d295ff215d3';


// var username = 'homefixer';
// var apikey   = 'c430018837f7fa144d1c0b5ea21a21dbd8340bcc7dd0a9a23898afba9f3f6b23';
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
                                console.log("Unable to find alerts for national")
                            } else {
                                alerts.forEach(function(alert) {
                                    if (id["idNumber"] === alert.details["idNumber"]) {
                                        var to = alert.details["mobileNumber"];

                                        function sendMessage(req, res) {

                                            // Define the recipient numbers in a comma separated string
                                            // Numbers should be in international format as shown
                                            var to = alert.details["mobileNumber"];

                                            // And of course we want our recipients to know what we really do
                                            var message = "Your ID number " + alert.details["idNumber"] + " has been posted on sakadocs.";

                                            // Build the post string from an object

                                            var post_data = querystring.stringify({
                                                'username': username,
                                                'to': to,
                                                'message': message
                                            });
                                            var post_options = {
                                                host: 'api.sandbox.africastalking.com',
                                                path: '/version1/messaging',
                                                method: 'POST',

                                                rejectUnauthorized: false,
                                                requestCert: true,
                                                agent: false,

                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Content-Length': post_data.length,
                                                    'Accept': 'application/json',
                                                    'apikey': apikey
                                                }
                                            };

                                            var post_req = https.request(post_options, function(res) {
                                                res.setEncoding('utf8');
                                                res.on('data', function(chunk) {
                                                    var jsObject = JSON.parse(chunk);
                                                    console.log(jsObject)
                                                    var recipients = jsObject.SMSMessageData.Recipients;
                                                    if (recipients.length > 0) {
                                                        for (var i = 0; i < recipients.length; ++i) {
                                                            var logStr = 'number=' + recipients[i].number;
                                                            logStr += ';cost=' + recipients[i].cost;
                                                            logStr += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                                                            console.log(logStr);
                                                        }
                                                    } else {
                                                        console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
                                                    }
                                                });
                                            });

                                            // Add post parameters to the http request
                                            post_req.write(post_data);

                                            post_req.end();
                                        }
                                        //Call sendMessage method
                                        sendMessage(req, res);
                                    }
                                });
                            }
                        });
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