// Filename: lib/emailer.js

var emailer	= require('nodemailer');

var Emailer = function(options, data) {
	this.options = options;
	this.data = data;
};

Emailer.prototype.send = function(callback) {
	var html = this.getHtml();

	var messageData = {
		to: '"' + this.options.to.first_name + ' ' + this.options.to.last_name + ' <' + this.options.to.email + '>',
		from: 'U.S. NetworX',
		subject: this.options.subject,
		html: html,
		generateTextFromHTML: true
	};
	
	var transport = this.getTransport();

	transport.sendMail(messageData, callback);
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
	return '<h1>This is a test. Do not be ill armed</h1>';
};

module.exports = Emailer;