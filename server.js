var http = require('http');
var https = require('spdy');
var express = require("express");

var app = express();
var LEX = require('letsencrypt-express');
var lex = LEX.create({
  configDir: './letsencrypt.config'                 // ~/letsencrypt, /etc/letsencrypt, whatever you want

, onRequest: app                                    // your express app (or plain node http app)

, letsencrypt: null

, approveRegistration: function (hostname, cb) {
    cb(null, {
      domains: [hostname]
    , email: 'mcdonalda1993@gmail.com'
    , agreeTos: true
    });
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