'use strict';

module.exports = function(app) {
    var students = require('../../app/controllers/students.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/studentids')
        .get(students.list)
    app.route('/poststudentid')
        .post(students.create);
    app.route('/studentid/:id')
        .get(students.read);
    app.route('/studentids/:finderNumber')
        .get(students.mystudentids);
};