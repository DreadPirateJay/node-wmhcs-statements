// Filename: routes/clients.js

var request = require('request')
	, Client 	= require('../models/client.js')
	, Clients = require('../models/clients.js');


var ClientsController = {
	apiUrl: 'http://billing.usnx.com/includes/api.php',

	index: function(req, res) {
		this.format = req.query.format || 'html';

		var self = this;
		var clients = new Clients([], { clientId: null });

		clients.fetch({
			success: function(clients) {
				switch (self.format) {

					case 'json':
						res.send(clients.toJSON());
						break;

					case 'html':
					default:
						res.render('clients/index', {
							title: 'Client List',
							clients: clients.toJSON()
						});
						break;
				}
			}
		});
	}
};

exports.index = function(req, res) { ClientsController.index(req, res); };
