var http = require('http');
var fs = require('fs')
var https = require('spdy');
var nunjucks =  require('nunjucks');
var express = require("express");

var sslPath = '/etc/letsencrypt/live/andrewmcdonald.co.uk/';
var app = express();

var options = {  
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

var server = https.createServer(options, app);

server.listen(443)
app.listen(80)
	
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

function redirectHttp() {
//   http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
//     res.setHeader('Location', 'https://' + req.headers.host + req.url);
//     res.statusCode = 302;
//     res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
//   })).listen(80);
}