'use strict';

/**
 * @ngdoc service
 * @name m2mApp.webWorkers
 * @description
 * # /webWorkers
 * Factory in the m2mApp.
 */
angular.module('m2mApp')
  	.factory('webWorkers', ['$http', function ($http) {

      var jsAjax = function(req,cfunc,efun){
        req.async = (req.async!=undefined)?req.async:true;
        var xhttp=new XMLHttpRequest();
        function arrayBufferConvert(rsp){
          var arr = new Uint8Array(rsp),
          raw = String.fromCharCode.apply(null,arr);
          return btoa(raw);
        }

        xhttp.onload = function(e) {
        	if (xhttp.readyState == 4 && xhttp.status == 200 ) {
            if(typeof cfunc =="function"){

              var result = ""
              try {
                if(req.type == 'arraybuffer'){
                  result = arrayBufferConvert(this.response)
                }else{
                result = JSON.parse(xhttp.response)
                }
              } catch (e) {
                result = xhttp.response
              }
              cfunc(result)
            }
        	}else {
            if(xhttp.status == 400 || xhttp.status == 404)
            if(typeof efun =="function")efun(xhttp);
        	}
        };
        xhttp.open(req.method, req.url, req.async);
        if(req.type)xhttp.responseType = req.type;//'arraybuffer';
        if(req.headers){
          for (var i in req.headers) {
            xhttp.setRequestHeader(i, req.headers[i]);
          }
        }
        if(!req.data)req.data="";
        xhttp.send(JSON.stringify(req.data));
      }


      var worker,workerResult = "function workerResult(res){self.postMessage(res)}";

      return {
        execute : function(exeFn,callB){
          exeFn = ";var exeFn = "+exeFn+";exeFn()"
          var file = new Blob([workerResult+exeFn], {type: "js"});
          var url = window.URL.createObjectURL(file);
          worker = new Worker(url)
          worker.addEventListener('message', function(e) {
            callB(e.data);
            worker.terminate();
          }, false);
        },
       httpcall : function(req,callB){
         var file = new Blob([workerResult+";var httpreq = "+jsAjax+"; httpreq("+JSON.stringify(req)+",function(d){workerResult(d)})"], {type: "js"});
         var url = window.URL.createObjectURL(file);
         worker = new Worker(url);
         worker.addEventListener('message', function(e) {
           callB(e.data);
           worker.terminate();
         }, false);
       }
      }

  }]);
