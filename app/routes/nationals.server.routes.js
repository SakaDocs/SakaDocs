'use strict';

module.exports = function(app) {
    var nationals = require('../../app/controllers/nationals.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/nationalids')
        .get(nationals.list)
        .post(nationals.create);
    app.route('/nationalids/:nationalId')
        .get(nationals.read);
    
};

