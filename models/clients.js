// Filename: models/client.js

var _ 					= require('underscore')
	,	Backbone 		= require('backbone')
	, request			= require('request')
	, Client			= require('./client')
	, Q						= require('q');

var Clients = Backbone.Collection.extend({
	model: Client,

	url: 'https://billing.usnx.com/includes/api.php',

	form: {
		username: 'jearwood',
		password: '3901d6ccf4f510cd72c67573e864a4df',
		action: 'getclients',
		responsetype: 'json'
	},

	initialize: function(models, options) {

	},

	// We need to override the default Backbone.sync method to be compatible with
	// the WHMCS API
	sync: function(method, collection, options) {
		var self = this;

		request.post(this.url, { form: this.form },
		function(error, response, body) {
			if (!error && response.statusCode === 200 && JSON.parse(body).result === 'success') {
				_.each(JSON.parse(body).clients.client, function(client) {
					self.add(new Client(client));
				});

				return options.success(self.models, response, options);
			} else {
				return options.error(self, response, options);
			} 
		});
	}
});

module.exports = Clients;