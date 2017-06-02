var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
// var favicon = require('serve-favicon');
var port = process.env.PORT || 4200;

// app.use(favicon(__dirname + '/favicon.ico'));

app.get('/ping', function (req, res, next) {
  console.log(req.body);
  res.send('pong');
});


var staticRoot = __dirname + '/';

app.use(express.static(staticRoot));

// app.use(express.static('./'));
// Any deep link calls should return index.html
// app.use('/*', express.static('./index.html'));

app.use(function (req, res, next) {

  // if the request is not html then move along
  var accept = req.accepts('html', 'json', 'xml');
  if (accept !== 'html') {
    return next();
  }

  // // if the request has a '.' assume that it's for a file, move along
  // var ext = path.extname(req.path);
  // if (ext !== '') {
  //   return next();
  // }

  fs.createReadStream(staticRoot + 'index.html').pipe(res);
});

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
  console.log(
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

