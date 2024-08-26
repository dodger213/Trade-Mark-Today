const express = require('express');
const https = require('https');
const fs = require('fs');
const next = require('next');
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const connectToMongodb = require('./src/db/mongodb');
dotenv.config({ path: "./.env" });
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
console.log('started')
app.prepare().then(() => {
  const server = express();
  server.use(morgan('dev'))
  server.use(express.json());
  server.use(cors());
  server.use(bodyParser.json());
  server.use(express.static(path.join(__dirname, 'public')))
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  console.error('before connecting...')
  connectToMongodb();
  console.error('after connecting...')
  console.log('after connecting...')
  server.all('*', (req, res) => {
    return handle(req, res);
    // res.send("<h1>This site is temporarily down.</h1> <p>The website developer is waiting response from <b>Syed Mosawi.</b></p><p> Please contact developer.</p> Skype or telegram is available.<i> louiswinkler72@gmail.com</i>");
  });
  // server.listen(process.env.PORT, (err) => {
  //   if (err) throw err;
  //   console.log('> Ready on http://localhost:' + process.env.PORT);
  // });
  https.createServer(options, server).listen(443, () => {
    console.log('Server running on https://localhost');
  });
});
