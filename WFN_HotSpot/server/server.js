'use strict';

var http = require('http');
var loopback = require('loopback');
var boot = require('loopback-boot');
var https = require('https');
var httpsRedirect = require('./middleware/https-redirect');
var explorer = require('./middleware/explorer');
var sslCert = require('./ssl/ssl-cert');


var app = module.exports = loopback();

var httpsOptions = {
  key: exports.privateKey,
  cert: exports.certificate
};

//var httpsPort = 3001; //app.get('httpsport');
//console.log("https request at port "+httpsPort);
//app.use(httpsRedirect({httpsPort: httpsPort}));

// Set up API explorer
explorer(app);

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
//app.use(loopback.errorHandler());

// Set up route for `/` to show loopback status for now
//app.get('/', loopback.status());



app.start = function() {
    
    
  // start the web server
  var port = app.get('port');
  var httpsPort = app.get('httpsport');
  console.log("https request at port "+httpsPort);
  app.use(httpsRedirect({httpsPort: httpsPort}));

  https.createServer(httpsOptions, app).listen(httpsPort, function() {
      var baseUrl = app.get('url').replace(/\/$/, '');
      app.emit('started');
      console.log('Web server listening at: %s', app.get('url'));
      
      if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
     }
      
    });


 /* http.createServer(app).listen(port, function() {
    console.log('Web server listening at: %s', 'http://localhost:3000/');
    https.createServer(httpsOptions, app).listen(httpsPort, function() {
      app.emit('started');
      console.log('Web server listening at: %s', app.get('url'));
      
      if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
     }
      
    });
  });
   */ 
    /*
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  */
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
