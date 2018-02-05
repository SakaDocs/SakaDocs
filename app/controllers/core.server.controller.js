'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    sms = require('./sms.server.controller.js'),
    National = mongoose.model('National'),
    Atm = mongoose.model('Atm'),
    Certificate = mongoose.model('Certificate'),
    Dl = mongoose.model('Dl'),
    Nhif = mongoose.model('Nhif'),
    Passport = mongoose.model('Passport'),
    Staff = mongoose.model('Staff'),
    Student = mongoose.model('Student'),
    _ = require('lodash');
// We need this to build our post string
var querystring = require('querystring');
var https = require('https');
// Africa'stalking logins
var username = 'sandbox';
var apikey = '98200eccd2ee9091c41614b786c288d8409368297a5efa257b0b6d295ff215d3';

var prettyjson = require('prettyjson');
var options = {
    noColor: true
};

exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};
exports.doctype = function(req, res) {

};
exports.mpesac2bvalidation = function(req, res) {
    var docType = req.body.BillRefNumber.toUpperCase().charAt(0);
    var message = {
        "ResultCode": 0,
        "ResultDesc": "Success",
        "ThirdPartyTransID": "1234567890"
    };
    if (docType === 'N') {
        National.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'A') {
        Atm.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'C') {
        Certificate.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'D') {
        Dl.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'I') {
        Nhif.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'P') {
        Passport.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'S') {
        Student.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    } else if (docType === 'J') {
        Staff.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(message);
            }
        });
    }
};
exports.mpesac2bconfirmation = function(req, res) {
    // define variable for storing amount paid
    var amountPaid = req.body.Amount
    var docType = req.body.BillRefNumber.toUpperCase().charAt(0);
    var to = "+" + req.body.Msisdn;
    var result = {
        "ResultCode": 0,
        "ResultDesc": "Success"
    };
    if (docType === 'N') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            National.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {

                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your ID through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'A') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Atm.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your ATM card through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'C') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Certificate.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your Certificate through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }

    } else if (docType === 'D') {
        if (amountPaid != "500.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Dl.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your Driving license through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'I') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Nhif.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your Insurance card through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'P') {
        if (amountPaid != "1000.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Passport.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        console.log(claimedId);
                        var message = "Payment received. Contact the Poster of your Passport through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'S') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Student.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your student ID through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    } else if (docType === 'J') {
        if (amountPaid != "300.00") {
            var fail = {
                "ResultCode": 1,
                "ResultDesc": "Rejecting the transaction"
            }
            res.json(fail);
        } else {
            Staff.find({ "accountNumber": req.body.BillRefNumber.toUpperCase() }).exec(function(err, id) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var claimedId = id[0];
                    if (claimedId === undefined) {
                        res.json(result);
                    } else {
                        var message = "Payment received. Contact the Poster of your staff ID through " + claimedId.finderNumber + ". Give SakaDocs code " + claimedId.sakaDocsCode + " to the Poster after getting your document.";
                        // send sms to user
                        sms.sendMessage(to, message, req, res);
                        claimedId.claimed = true;
                        claimedId.claimedBy = to;
                        claimedId.save(function(err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                res.json(result);
                            }
                        })
                    }
                }
            });
        }
    }

};