'use strict';

module.exports = function(app) {
	// var multer = require('multer');
    var nationals = require('../../app/controllers/nationals.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/nationalids')
        .get(nationals.list)
     app.route('/postnationalid')
        .post(nationals.create);
    app.route('/nationalid/:id')
        .get(nationals.read);
    
};

