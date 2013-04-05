// Filename: lib/emailer.js

var emailer	= require('nodemailer')
	,	fs			= require('fs')
	,	_				= require('underscore');

var Emailer = function() {
	this.options = {};
	this.data = {};
	this.transport = this.getTransport();
};

Emailer.prototype.send = function(options, data, callback) {
	this.options = options;
	this.data = data;

	var html = this.getHtml(this.options.template, this.data);

	var messageData = {
		to: '"' + this.options.to.first_name + ' ' + this.options.to.last_name + ' <' + this.options.to.email + '>',
		from: 'U.S. NetworX',
		subject: this.options.subject,
		html: html,
		generateTextFromHTML: true
	};

	this.transport.sendMail(messageData, callback);
};

Emailer.prototype.getTransport = function() {
	return emailer.createTransport("SMTP", {
		service: "Gmail",
		auth: {
			user: 'jay.earwood@gmail.com',
			pass: 'xyzzy001'
		}
	});
};

Emailer.prototype.getHtml = function(templateName, data) {
	var templatePath = './views/emails/templates/' + templateName +'.html';
	var templateContent = fs.readFileSync(templatePath, encoding='utf8');
	return _.template(templateContent, data);
};

module.exports = Emailer;