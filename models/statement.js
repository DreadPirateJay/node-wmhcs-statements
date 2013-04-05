// Filename: models/statement.js

var _					= require('underscore')
	,	Backbone	= require('backbone')
	, LineItem	= require('./line-item');

var Statement = Backbone.Collection.extend({
	model: LineItem,

	comparator: function(model) {
		return (new Date(model.get('date'))).getTime();
	}
});

module.exports = Statement;
