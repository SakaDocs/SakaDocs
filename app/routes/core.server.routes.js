'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
	app.route('/doctype').get(core.doctype);
	app.route('/mpesac2bvalidation').post(core.mpesac2bvalidation);
	app.route('/mpesac2bconfirmation').post(core.mpesac2bconfirmation);
};