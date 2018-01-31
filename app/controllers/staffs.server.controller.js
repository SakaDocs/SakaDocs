'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Staff = mongoose.model('Staff'),
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
        folder: 'staff_ids',
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
                    jobNumber: idDetails.admissionNumber,
                    locationFound: idDetails.location,
                    companyName: idDetails.companyName,
                    finderNumber: idDetails.finderNumber

                }
            } else {
                var idDetails = JSON.parse(req.body.iddetails);
                var id = {
                    fullNames: idDetails.fullNames,
                    jobNumber: idDetails.jobNumber,
                    locationFound: idDetails.location,
                    companyName: idDetails.companyName,
                    finderNumber: idDetails.finderNumber,
                    idPhoto: req.file.secure_url
                };
                var staff = new Staff(id);
                staff.save(function(err) {
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
                 Alert.find({ "docType": "staff" }).exec(function(err, alerts) {
                    if (err) {
                        console.log("Unable to find alerts for staff ids")
                    } else {
                        alerts.forEach(function(alert) {
                            if (id["fullNames"] === alert.details["fullNames"] && id["companyName"] === alert.details["companyName"]) {
                                function sendMessage() {

                                    // Define the recipient numbers in a comma separated string
                                    // Numbers should be in international format as shown
                                    var to = alert.details["mobileNumber"];

                                    // And of course we want our recipients to know what we really do
                                    var message = "Your staff ID " + alert.details["fullNames"] + " has been posted on sakadocs.";

                                    // Build the post string from an object

                                    var post_data = querystring.stringify({
                                        'username': username,
                                        'to': to,
                                        'message': message
                                    });

                                    var post_options = {
                                        host: 'api.africastalking.com',
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
                                            console.log(chunk);
                                            var jsObject = JSON.parse(chunk);
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
                                sendMessage();
                            }
                        });
                    }
                });

            }
        }
    })
};

/**
 * Show the current staff
 */

exports.read = function(req, res) {
    Staff.findById(req.params.id).exec(function(err, id) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!id) {
                return res.status(404).send({
                    message: 'Student ID not found'
                });
            }
            res.json(id);
        }
    });
};


exports.mystaffids = function(req, res) {

    var fN = req.params.finderNumber;
    Staff.find({ "finderNumber": fN }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};


exports.staffIdAlert = function(req, res) {
    var alert = new Alert({
        docType: "staffId",
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
    Staff.find({ "claimed": false }).exec(function(err, ids) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ids.reverse());
        }
    });
};