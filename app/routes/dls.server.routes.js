'use strict';

module.exports = function(app) {
    var dls = require('../../app/controllers/dls.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/dls')
        .get(dls.list)
    app.route('/postdl')
        .post(dls.create);
    app.route('/dl/:id')
        .get(dls.read);
    app.route('/dls/:finderNumber')
        .get(dls.mydls);
    app.route('/dlalert')
        .post(dls.dlAlert);
};