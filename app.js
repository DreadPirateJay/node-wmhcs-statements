// Filename: app.js

// Import nodejs modules
var express = require('express')
  , routes = require('./routes')
  , clients = require('./routes/clients')
  , statements = require('./routes/statements')
  , http = require('http')
  , path = require('path');

// Create the Express application
var app = express();

// Configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Development specific configuration
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Application routes
// Route functions are defined in files in the /routes directory
app.get('/', routes.index);
app.get('/clients/', clients.index);
app.get('/statements/:clientid', statements.index);

// Create a web server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
