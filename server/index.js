const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path');

const { PORT, DATABASE_URL } = require('./config'),
      { router } = require('./routes');

const app = express();

mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use('/api', router);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get(['/', '/survey', '/congratulations', '/feedback', '/thank-you', '/candidates/:_id', '/404'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
});

app.get('*', (req, res) => {
  res.redirect('/404');
});

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      let server = app.listen(port, () => {
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };

        const timeNow = new Date().toLocaleTimeString('en-us', options);

        console.log(`Hire Humanly server listening on port ${port}: ${timeNow}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
         if (err) {
           return reject(err);
         }
         resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
