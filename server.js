// import { readCSV, udpateFromCSV } from './src/js/data/data_reader';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import _ from 'lodash';
import nonce from 'nonce';
import helmet from 'helmet';

import logger from './logger';


const express = require('express');

const app = express();

if (process.env.NODE_ENV !== 'development') {
  console.log('enabling hsts');
  app.use(helmet());
  app.disable('x-powered-by');
  const sixtyDaysInSeconds = 5184000;
  app.use(helmet.hsts({
    maxAge: sixtyDaysInSeconds
  }));
}

app.use((req, res, next) => {
  res.locals.nonce = nonce();
  logger.info({
    method: req.method, path: req.url, params: req.params, body: req.body
  });
  next();
});

// CORS disabled
const corsOptions = {
  origin: function (origin, callback) {
    // if (whitelist.indexOf(origin) !== -1) {
    callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  }
};

app.set('trust proxy', true);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/healthcheck', cors(corsOptions), async (req, res) => {
  res.status(200).send({ message: 'ok' });
});

app.get('/node-api/get_category_data', cors(corsOptions), async (req, res) => {
  const results = [];
  await fs.createReadStream(path.resolve(__dirname, 'src', 'data', 'covid_activities.csv'))
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      res.send({ data: results });
    });
});

app.get('/node-api/get_state_wise_helpline_data', cors(corsOptions), async (req, res) => {
  const results = [];
  try {
    await fs.createReadStream(path.resolve(__dirname, 'src', 'data', 'covid_mapping_helplines.csv'))
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          state: data.State,
          covid_helpline_numbers: data['Coronavirus Helpline Numbers'].split(/\n/)
        });
      })
      .on('end', () => {
        if (req.query && req.query.state != null) {
          const stateData = _.find(results, (result) => {
            return result.state.toLowerCase() === req.query.state.toLowerCase();
          });
          if (stateData) {
            res.send({ data: stateData });
          } else {
            res.status(404).send({ message: 'State helpline data not present' });
          }
        } else {
          res.send({ data: results });
        }
      });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: 'Bad Request' });
  }
});

// Put all API endpoints under '/api'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App listening on ${port}`);
