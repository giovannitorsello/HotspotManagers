/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var named = require('node-named');
var named = require('./lib/index');
var server = named.createServer();
var ttl = 300;

server.listen(9999, '127.0.0.1', function() {
    console.log('DNS server started on port 9999');
});

server.on('query', function(query) {
    var domain = query.name();
    console.log('DNS Query: %s', domain)
    var target = new SOARecord(domain, {serial: 12345});
    query.addAnswer(domain, "192.168.56.1", ttl);
    server.send(query);
});