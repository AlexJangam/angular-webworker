/*jslint node: true */
"use strict";
/*global JSWebWorker:true, postMessage:true, setTimeout:true, document:true, console:true */

var req, exeTest = new JSWebWorker();

exeTest.execute(function () {
    var i = 0;
    function timedCount() {
        i = i + 1;
        postMessage(i);
        setTimeout(function () {
            timedCount();
        }, 500);
    }
    timedCount();
}).then(function (worker, data) {
    document.getElementById("exectext").innerHTML = "Exec Data : " + data;
    console.log("timeout ", data);
    if (data === 3) {
        worker.terminate();
    }
});

req = {
    url : "http://localhost:1022/test/sampledata/contacts.json",
    headers : {
        "Content-Type" : "application/json",
        "JSONP" : true
    }
};

new JSWebWorker().httpcall(req, function (data) {
    postMessage(data.length);
}).then(function (data) {
    console.log(data);
    document.getElementById("responsetext").innerHTML = "Array Length : " + data;
});
