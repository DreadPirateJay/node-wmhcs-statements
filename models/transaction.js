// Filename: models/transaction.js

var _ 					= require('underscore')
	,	Backbone 		= require('backbone')
	, request			= require('request');

var Transaction = Backbone.Model.extend({});

var Transactions = Backbone.Collection.extend({
	model: Transaction,

	url: 'https://billing.usnx.com/includes/api.php',

	initialize: function(models, options) {
		this.clientId = options.clientId;
	},

	comparator: function(model) {
		return (new Date(model.get('date'))).getTime();
	},

	// We need to override the default Backbone.sync method to be compatible with
	// the WHMCS API
	sync: function(method, collection, options) {
		var jqXHR;
		var self = this;

		if (method === 'read') {
			request.post(this.url, {
				form: {
					username: 'jearwood',
					password: '3901d6ccf4f510cd72c67573e864a4df',
					action: 'gettransactions',
					clientid: this.clientId,
					responsetype: 'json'
				}
			},
			function(error, response, body) {
				if (!error && response.statusCode === 200 && JSON.parse(body).result === 'success') {
					
					if (JSON.parse(body).transactions) {
						_.each(JSON.parse(body).transactions.transaction, function(transaction) {
							self.add(new Transaction(transaction));
						});
					}

					return options.success(self.models);
				} else {
					return options.error(new Error('An error was encountered trying to connect to the server.'));
				} 
			});
		}
	}
});

module.exports = Transactions;