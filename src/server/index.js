const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");
const app = express();
// const favicon = require('serve-favicon');
const port = process.env.PORT || 4200;

// app.use(favicon(__dirname + '/favicon.ico'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const twilioSettings = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phone: process.env.TWILIO_PHONE
};

const twilio = require('twilio');
const client = twilio(twilioSettings.accountSid, twilioSettings.authToken);

app.get('/ping', (req, res, next) => {
  console.log(req.body);
  res.send('pong');
});

app.post("/messages", (req, res, next) => {
  var msg = {
    from: twilioSettings.phone,
    to: req.body.phone,
    body: req.body.body
  };
  console.log('sending', msg);
  client.messages.create(msg)
    .then(data => {
      if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ result: "success" }));
      } else {
        res.redirect("/messages/" + msg.phone + "#" + data.sid);
      }
    }).catch(err => {
      if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        res.status(err.status).send(JSON.stringify(err));
      } else {
        res.redirect(req.header('Referer') || '/');
      }
    });
});

var staticRoot = __dirname + '/';

app.use(express.static(staticRoot));

// app.use(express.static('./'));
// Any deep link calls should return index.html
// app.use('/*', express.static('./index.html'));

app.use((req, res, next) => {

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

app.listen(port, () => {
  console.log('Express server listening on port ' + port);
  console.log(
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});
