/*global require:true, express:true, __dirname:true, console:true */

//Port node uses for this demo
var portNo = 1022;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
});
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/'));

app.listen(portNo, function () {
    console.log("Port Open : ", portNo);
});
