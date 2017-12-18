'use strict';

module.exports = function(app) {
    var nhifs = require('../../app/controllers/nhifs.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    // Routing logic   
    app.route('/nhifs')
        .get(nhifs.list)
     app.route('/postnhifcard')
        .post(nhifs.create);
    app.route('/nhifcard/:id')
        .get(nhifs.read);
    app.route('/nhifcards/:finderNumber')
        .get(nhifs.mynhifs);
    
};