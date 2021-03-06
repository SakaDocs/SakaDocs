'use strict';

module.exports = function(app) {
    var staffs = require('../../app/controllers/staffs.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/staffids')
        .get(staffs.list)
    app.route('/poststaffid')
        .post(staffs.create);
    app.route('/staffid/:id')
        .get(staffs.read);
    app.route('/staffids/:finderNumber')
        .get(staffs.mystaffids);
    app.route('/staffidalert')
        .post(staffs.staffIdAlert);
};