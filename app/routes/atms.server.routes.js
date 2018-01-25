'use strict';

module.exports = function(app) {
    var atms = require('../../app/controllers/atms.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/atms')
        .get(atms.list)
     app.route('/postatm')
        .post(atms.create);
    app.route('/atm/:id')
        .get(atms.read);
    app.route('/atms/:finderNumber')
        .get(atms.myatms);
     app.route('/atmalert')
        .post(atms.atmAlert);
    
};