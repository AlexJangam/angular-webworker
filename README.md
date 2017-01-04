**angular-webworker** is a js wrapper for angular js support, which can be used directly with JS, JQuery or with Angular js.


Author: Jangam Alexander Pradeep ([AlexJangam](https://github.com/AlexJangam))

## Usage

## Angular
1. Install via either [npm](https://github.com/AlexJangam/angular-webworker) or downloaded files:
    1. `bower install angular-webworker`
    2. download [angular-webworker.zip](https://github.com/AlexJangam/angular-webworker/zipball/master)
2. Include dependencies in your HTML.
    1. When using bower:
    ```html
    <script src="bower_components/angular-webworker/angular-webworker.js"></script>
    ```
    2. when using downloaded files
    ```html
    <script src="angular-webworker.js"></script>
    ```
3. Add **`webworker`** to your application's module dependencies

    ```JavaScript
    angular.module('app', ['webworker']);
    ```
4. Use the factory `webworker`

    ```JavaScript
    angular.module('app')
        .controller('appController', function($scope, webworker){

          //this initialization terminates the webworker on first message.
          webworker.execute(function () {
            //Do stuff here, and emit data in "postMessage"
              var i = 0;
              function timedCount() {
                  i = i + 1;
                  postMessage(i);//This is what is sent to .then() promise function.
                  setTimeout(function () {  
                      timedCount();
                  }, 500);
              }
              timedCount();
          }).then(function (worker, data) {//we can use worker.terminate() to terminate the web worker at any point of time.
              document.getElementById("mytext").innerHTML = "Exec Data : " + data;
          });


          //If we need the worker to continously send data without auto termination after first message, then use below
          var manual = true;
          myworker.execute(manual, function () {
            //"manual" is optional and is only used if worker keeps running in background to continuously emit data, If not specified then worker will terminate upon first message.
              var i = 0;
              function timedCount() {
                  i = i + 1;
                  postMessage(i);//This is what is sent to .then() promise function.
                  setTimeout(function () {  
                      timedCount();
                  }, 500);
              }
              timedCount();
          }).then(function (worker, data) {
              //we can use worker.terminate() to terminate the web worker at any point of time.
              document.getElementById("mytext").innerHTML = "Exec Data : " + data;
              if (data === 3) {
                  worker.terminate();//terminate on count of 3
              }
          });          
        });


    ```
## JS and JQUERY
  Follow steps 1 and 2 of Angular.

  3. initialization and Use of JSWebWorker.

  ```JavaScript
  var newworker = new JSWebWorker();
  newworker.execute(function () {
    //Your executable code here.
  }).then(function (worker, data) {
    //Your result related code here.
  })
  ```
## Credits
Alexander Jangam ([Alex](https://github.com/AlexJangam))

## License
MIT
