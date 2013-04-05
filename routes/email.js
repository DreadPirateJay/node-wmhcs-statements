// Filename: routes/email.js

var	Clients			= require('../models/clients')
	, Statement		= require('../models/statement')
	, Emailer			= require('nodemailer')
	, Q						= require('q')
	, Emailer 		= require('../lib/emailer');

var EmailController = {

	send: function(req, res) {
		var self = this;

		options = {
			to: {
				email: 'jearwood@usnx.com',
				firstname: 'Jay',
				lastname: 'Earwood'
			},
			subject: 'Mailer Test'
		};

		data = {
			test: 'test'
		};

		emailer = new Emailer(options, data);
		emailer.send(function(err, result) {
			if (err) {
				res.send('ERROR: ' + err);
			} else {
				res.send(result);
			}
		});
	},

	fetchClients: function() {
		var clients = new Clients();
		var deferred = Q.defer();

		clients.fetch({
			success: function(clients) {
				deferred.resolve(clients.toJSON());
			},
			error: function(collection, xhr) {
				deferred.reject(xhr);
			}
		});

		return deferred.promise;
	},
};

exports.send = function(req, res) { EmailController.send(req, res) };