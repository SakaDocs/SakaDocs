'use strict';

module.exports = function(app) {
    var passports = require('../../app/controllers/passports.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/passports')
        .get(passports.list)
    app.route('/postpassport')
        .post(passports.create);
    app.route('/passport/:id')
        .get(passports.read);
    app.route('/passports/:finderNumber')
        .get(passports.mypassports);
    app.route('/passportalert')
        .post(passports.passportAlert);

};