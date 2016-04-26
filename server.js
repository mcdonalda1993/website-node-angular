var http = require('http');
var https = require('spdy');
var LEX = require('letsencrypt-express');

var lex = LEX.create({
  configDir: require('os').homedir() + '/letsencrypt/etc'
, approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration
    // Note: this is the place to check your database to get the user associated with this domain
		// Also: this check should be more comprehensive to ensure "andrewmcdonald.co.uk" isn't a subdomain 
		if(hostname.indexOf("andrewmcdonald.co.uk") >= 0){
			cb(null, {
				domains: [hostname]
			, email: 'mcdonalda1993@gmail.com'
			, agreeTos: true
			});
		}
  }
});

function redirectHttp() {
  http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
    res.setHeader('Location', 'https://' + req.headers.host + req.url);
    res.statusCode = 302;
    res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
  })).listen(80);
}

function serveHttps() {
	var nunjucks =  require('nunjucks');
	var express = require("express");

	var app = express();
	app.use(express.static('public'));
	nunjucks.configure('views', {
		autoescape: true,
		express: app
	});

	app.get("/update", function(req, res){
		var context = {};
		
		var exec = require('child_process').execSync;
		var getCurrentHashCMD = 'git show-ref';
		var getLatestRemoteHashCMD = 'git ls-remote origin';
		var updateCMD = "git pull";

		context.current = exec(getCurrentHashCMD).toString().split(" ")[0];
		
		context.latest = exec(getLatestRemoteHashCMD).toString().split("	")[0];
		
		if(context.current != context.latest){
			exec(updateCMD);
		}
		
		res.render("update.html", context)
	});

	app.get("/", function(req, res){
		res.render("index.html");
	});

  https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app)).listen(443);
}

redirectHttp();
serveHttps();