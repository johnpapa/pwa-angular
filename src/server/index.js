const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const routes = require('./routes');

const root = './public';
const public = process.env.PUBLIC || `${root}`;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes);

const twilioSettings = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phone: process.env.TWILIO_PHONE
};

app.get('/ping', (req, res, next) => {
  console.log(req.body);
  res.send('pong');
});

app.get('/api/heroes', (req, res, next) => {
  console.log(req.body);
  res.sendFile('../api/heroes.json', { root: root });
});

app.get('../api/villains', (req, res, next) => {
  console.log(req.body);
  res.sendFile('api/villains.json', { root: root });
});

app.post('/messages', (req, res, next) => {
  try {
    const twilio = require('twilio');
    const client = twilio(twilioSettings.accountSid, twilioSettings.authToken);

    var msg = {
      from: twilioSettings.phone,
      to: req.body.phone,
      body: req.body.body
    };
    console.log('sending', msg);
    client.messages
      .create(msg)
      .then(data => {
        if (req.xhr) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ result: 'success' }));
        } else {
          res.redirect('/messages/' + msg.phone + '#' + data.sid);
        }
      })
      .catch(err => {
        if (req.xhr) {
          res.setHeader('Content-Type', 'application/json');
          res.status(err.status).send(JSON.stringify(err));
        } else {
          res.redirect(req.header('Referer') || '/');
        }
      });
  } catch (error) {
    const msg = "twilio failed, but that's ok. We'll move along";
    console.log(msg);
    res.status(500).send(msg);
  }
});

app.use(express.static(public));
console.log(`serving ${public}`);

// app.use(express.static('./'));
// Any deep link calls should return index.html
// app.use('/*', express.static('./index.html'));

// app.use((req, res, next) => {
//   // if the request is not html then move along
//   var accept = req.accepts('html', 'json', 'xml');
//   if (accept !== 'html') {
//     return next();
//   }

//   // // if the request has a '.' assume that it's for a file, move along
//   // var ext = path.extname(req.path);
//   // if (ext !== '') {
//   //   return next();
//   // }

//   fs.createReadStream(staticRoot + 'index.html').pipe(res);
// });

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: root });
});

const port = process.env.PORT || '4201';
app.listen(port, () => console.log(`API running on localhost:${port}`));
