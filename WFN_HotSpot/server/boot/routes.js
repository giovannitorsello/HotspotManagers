/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = function(app) {
  console.log("install /login route");
  app.get('/login', function(req, res) {
    
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var content_type = req.headers['content-type'];
    var method=req.method;
    var protocol=req.protocol;      
    var user_agent=req.get('user-agent');
    
    var username=req.query.username;
    var password=req.query.password;
    
    console.log(ip +"\n"+            
            protocol +"\n"+
            method +"\n"+
            content_type +"\n"+
            user_agent +"\n"+
            username +"\n"+
            password +"\n");
    
    res.redirect('/success.html');
  });
}