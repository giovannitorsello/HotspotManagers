// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-example-ssl
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');
var bodyParser = require('body-parser')

var app = module.exports = loopback();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// boot scripts mount components like REST API
//boot(app, __dirname);

app.start = function(httpOnly) {
    if (httpOnly === undefined) {
        httpOnly = process.env.HTTP;
    }
    var server = null;
    if (!httpOnly) {
        var options = {
            key: sslConfig.privateKey,
            cert: sslConfig.certificate,
            passphrase: sslConfig.passphrase
        };
        server = https.createServer(options, app);
    } else {
        server = http.createServer(app);
    }
    
    server.listen(app.get('port'), function() {
            var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
            app.emit('started', baseUrl);
            console.log('LoopBack server listening @ %s%s', baseUrl, '/');
            if (app.get('loopback-component-explorer')) {
                var explorerPath = app.get('loopback-component-explorer').mountPath;
                console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
            }            
        });
    
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  
  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
