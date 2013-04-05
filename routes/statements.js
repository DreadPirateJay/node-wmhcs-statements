// Filename: route/statement.js

var request = require('request')
	,	Q = require('q')
	, moment = require('moment')
	, _ = require('underscore')
	, Clients = require('../models/clients')
	, Invoices = require('../models/invoice')
	, Transactions = require('../models/transaction')
	, Statement = require('../models/statement')
	, LineItem = require('../models/line-item');


var StatementsController = {
	apiUrl: 'http://billing.usnx.com/includes/api.php',

	index: function(req, res) {
		this.format = req.query.format || 'html';

		var self = this;

		Q.all([
			this.getInvoices(req.params.clientid),
			this.getTransactions(req.params.clientid)
		]).then(function(results) {
			switch (self.format) {

				case 'json':
					res.send(self.parseStatement(results[0], results[1]));
					break;

				case 'html':
				default:
					res.render('statements/index', {
						title: 'Statements',
						statement: self.parseStatement(results[0], results[1])
					});
			}
		})
		.fail(function() {
			res.send(500, {error: 'Something blew up' });
		});

	},

	getInvoices: function(clientId) {
		var deferred = Q.defer();

		var invoices = new Invoices([], { clientId: clientId });
		invoices.fetch({
			success: function(invoices) {
				deferred.resolve(invoices);
			},
			error: function(invoices, response) {
				deferred.reject(new Error(response.error));
			}
		})

		return deferred.promise;
	},

	getTransactions: function(clientId) {
		var deferred = Q.defer();

		var transactions = new Transactions([], { clientId: clientId });
		transactions.fetch({
			success: function(transactions) {
				deferred.resolve(transactions);
			},
			error: function(transactions, response) {
				deferred.reject(response.error);
			}
		})

		return deferred.promise;
	},

	parseStatement: function(invoices, transactions) {
		var statement = new Statement();

		if (invoices.length > 0) {
			_.each(invoices.models, function(invoice) {
				statement.add(new LineItem({
					type: 'Invoice',
					date: moment(invoice.get('date')).format('MM/DD/YYYY'),
					description: '#' + invoice.get('id'),
					credits: invoice.get('credit'),
					debits: invoice.get('total')
				}));
			}, this);
		}

		if (transactions.length > 0) {
			_.each(transactions.models, function(transaction) {
				statement.add(new LineItem({
					type: 'Transaction',
					date: moment(transaction.get('date')).format('MM/DD/YYYY'),
					description: transaction.get('description') + ' #' + transaction.get('invoiceid'),
					credits: transaction.get('amountin'),
					debits: transaction.get('amountout')
				}));
			}, this);
		}

		return statement.toJSON();
	}
};

exports.index = function(req, res) { StatementsController.index(req, res); };