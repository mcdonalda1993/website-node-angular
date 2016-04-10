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

var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server listening at http://%s:%s", host, port);
});
