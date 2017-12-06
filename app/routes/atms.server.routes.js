'use strict';

module.exports = function(app) {
    var atms = require('../../app/controllers/atms.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/atms')
        .get(atms.list)
     app.route('/postatm')
        .post(atms.create);
    app.route('/atms/:id')
        .get(atms.read);
    
};