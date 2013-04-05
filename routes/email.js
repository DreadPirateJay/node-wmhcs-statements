// Filename: routes/email.js

var	Clients			= require('../models/clients')
	, Statement		= require('../models/statement')
	, _						= require('underscore')
	, Emailer 		= require('../lib/emailer');

var EmailController = {

	send: function(req, res) {
		var self = this;
		var emailer = new Emailer();

		this.fetchClients(function(clients) {
			_.each(clients, function(client) {

				options = {
					to: {
						email: 'jearwood@usnx.com',
						firstname: client.firstname,
						lastname: client.lastname
					},
					subject: 'Your U.S. NetworX Statement is Ready',
					template: 'statement-ready'
				};

				data = {
					id: client.id,
					firstname: client.firstname,
					lastname: client.lastname
				};

				emailer.send(options, data, function(err, result) {
					if (err) {
						console.log('ERROR: ' + err);
					} else {
						console.log(result);
					}
				});

			}, this);
		});

		res.send('Emails Sent!');
	},

	fetchClients: function(callback, error) {
		var clients = new Clients();

		clients.fetch({
			success: function(clients) {
				callback(clients.toJSON());
			},
			error: function(models, xhr) {
				error(xhr);
			}
		});
	},
};

exports.send = function(req, res) { EmailController.send(req, res) };