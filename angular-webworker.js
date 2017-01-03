/*jslint node: true */
"use strict";
/*global XMLHttpRequest:true, Worker:true, Blob:true, window:true, angular:true */
/**
* @author  Alexander Pradeep Jangam
* @web-worker factory
* @name webworker
* @description
* # /webworker
* Factory method for angularJS completely based on JS.
*/

function jsAjax(req, cfunc, efun) {//JavaScript ajax request.

    var xhttp = new XMLHttpRequest(), header;
    if (xhttp) {
        xhttp.open(req.method || "GET", req.url, req.async || true);
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    if (typeof cfunc === "function") {
                        var result = {};
                        try {
                            result = JSON.parse(xhttp.response);
                        } catch (eParse) {
                            result = xhttp.response;
                        }
                        cfunc(result);
                    }
                } else {
                    console.log("Invocation Errors Occured");
                }
            } else if (xhttp.status > 399 && typeof efun === "function") {
                efun(xhttp);
            }
        };

        for (header in req.headers) {
            if (req.headers.hasOwnProperty(header)) {
                xhttp.setRequestHeader(header, req.headers[header]);
            }
        }


        if (!req.data) {
            req.data = {};
        }
        xhttp.send(req.data && JSON.stringify(req.data));
    }
}

function JSWebWorker() {

    var worker, promise = function (name) {
        var allFns = [], dummy = function () { return; }, err = dummy;
        function ecb(e) {//Execute error function.
            return function (fn) {
                fn(e);
            };
        }

        function thnFn(fnCB) {//all functions from "then" are added into series of functions and exected one bt one
            allFns.push(fnCB);
            return {then : thnFn, error : err};
        }

        function exec() {//final function to be called after async call prom.exec
            var argArr = [], arg, i;
            for (arg = 0; arg < arguments.length; arg += 1) {
                argArr.push(arguments[arg]);
            }

            function sendOut() {//Once response is ready, execute .then functions
                err = dummy;
                for (i = 0; i < allFns.length; i += 1) {
                    try {
                        //execute all functions added to "then" promise.
                        allFns[i].apply(allFns[i], argArr);
                    } catch (erRes) {
                        err = ecb(erRes);
                        console.log((name ? (name + " : ") : "") + "failed at promise ", i + 1, " with message ", erRes);
                    }
                }
            }

            if (allFns.length > 0) {
                sendOut();//If promise functions are added, then execute immediately
            } else {
                setTimeout(sendOut, 10);//If promise functions are yet to be added then run after 10ms.
            }
        }
        return {
            prom : {then : thnFn, error : err},
            post : exec
        };
    }, workerResult = "function(res) {self.postMessage(res);};";

    return {
        execute : function (multi, exeFn) {
            if (typeof multi === "function") {
                exeFn = multi;
                multi = false;
            }

            var url, file, newProm = promise(), postwork = "var postwork = " + workerResult;
            exeFn = ";var exeFn = " + exeFn + ";exeFn()";
            file = new Blob([postwork + exeFn], {type: "js"});
            url = window.URL.createObjectURL(file);
            worker = new Worker(url);
            worker.addEventListener("message", function (e) {
                newProm.post(worker, e.data);
                if (!multi) {
                    worker.terminate();
                }
            }, false);
            return newProm.prom;
        },
        terminate : function () {
            worker.terminate();
        },
        httpcall : function (req, htFun) {
            var url, file, newProm = promise(), postwork = "var postwork = " + workerResult;
            if (typeof htFun === "function") {
                postwork = "var postwork = " + htFun.toString() + ";";
                postwork.replace("postMessage", "self.postMessage");
            }
            // console.log("var httpreq = "+jsAjax+"; httpreq("+JSON.stringify(req)+",function(d) {postwork(d)})","ssdd");
            file = new Blob([postwork + ";var httpreq = " + jsAjax + "; httpreq(" + JSON.stringify(req) + ",function(d) {postwork(d)})"], {type: "js"});
            url = window.URL.createObjectURL(file);
            window.open(url);
            worker = new Worker(url);
            worker.addEventListener("message", function (e) {
                newProm.post(e.data);
                worker.terminate();
            }, false);
            return newProm.prom;
        }
    };
}

try {
    angular.module("webworker")
        .factory("webworker", [function () {
            return new JSWebWorker();
        }]);
} catch (ignore) {

}
