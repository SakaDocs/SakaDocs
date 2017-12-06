'use strict';

module.exports = function(app) {
    var certificates = require('../../app/controllers/certificates.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/certificates')
        .get(certificates.list)
     app.route('/postcertificate')
        .post(certificates.create);
    app.route('/certificates/:id')
        .get(certificates.read);
    
};