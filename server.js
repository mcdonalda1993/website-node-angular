var express = require("express");
var app = express();

app.get("/", function(req, res){
	res.send("Hello World");
});

app.get("/update", function(req, res){
	var exec = require('child_process').execSync;
	var getCurrentHashCMD = 'git show-ref';
	var currentHash;
	var getLatestRemoteHashCMD = 'git ls-remote origin';
	var latestRemoteHash;
	var updateCMD = "git pull";

	currentHash = exec(getCurrentHashCMD).toString().split(" ")[0];
	
	latestRemoteHash = exec(getLatestRemoteHashCMD).toString().split(" ")[0];
	
	if(currentHash != latestRemoteHash){
		exec(updateCMD);
		res.send("Was on: " + currentHash + "\r\n Updated to: " + latestRemoteHash);
	} else{
		res.send("Up to date. On revision: " + currentHash);
	}
	res.send("Hello World");
});

var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server listening at http://%s:%s", host, port);
});
