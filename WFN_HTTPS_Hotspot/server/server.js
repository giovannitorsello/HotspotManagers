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
var bodyParser = require('body-parser');

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
    //if (!httpOnly) {
        var options = {
            key: sslConfig.privateKey,
            cert: sslConfig.certificate,
            passphrase: sslConfig.passphrase
        };
        server_https = https.createServer(options, app);
    //} else {
        server_http = http.createServer(app);
    //}
    
    
    //Start HTTPS Server
    server_https.listen(app.get('port-https'), function() {
            var baseUrl =  'https://' + app.get('host') + ':' + app.get('port-https');
            app.emit('started', baseUrl);
            console.log('LoopBack server listening @ %s%s', baseUrl, '/');
            if (app.get('loopback-component-explorer')) {
                var explorerPath = app.get('loopback-component-explorer').mountPath;
                console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
            }            
        });
    
    server_http.listen(app.get('port-http'), function() {
            var baseUrl = 'http://'  + app.get('host') + ':' + app.get('port-http');
            app.emit('started', baseUrl);
            console.log('LoopBack server listening @ %s%s', baseUrl, '/');
            if (app.get('loopback-component-explorer')) {
                var explorerPath = app.get('loopback-component-explorer').mountPath;
                console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
            }            
        });
    
    
    var named = require('node-named');
    var server_dns = named.createServer();
    var ttl = 300;

    server_dns.listen(9053, '0.0.0.0', function() {
        console.log('DNS server started on port 9053');
    });

    
    server_dns.on('query', function(query) {
        var domain = query.name();
        var type = query.type();
        console.log('DNS Query: (%s) %s', type, domain);
        switch (type) {
            case 'A':
                var record = new named.ARecord('192.168.56.1');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'AAAA':
                var record = new named.AAAARecord('192.168.56.1');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'CNAME':
                var record = new named.CNAMERecord('192.168.56.1');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'MX':
                var record = new named.MXRecord('192.168.56.1');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'SOA':
                var record = new named.SOARecord('192.168.56.1');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'SRV':
                var record = new named.SRVRecord('192.168.56.1', 5060);
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
            case 'TXT':
                var record = new named.TXTRecord('Hotspot Wifinetcom');
                query.addAnswer("wifiticket.wifinetcom.net", record, 300);
                break;
        }
        server_dns.send(query);
    });

    
};


//Boot Loopback App
boot(app, __dirname, function(err) {
  if (err) throw err;
  
  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
