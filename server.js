// import { readCSV, udpateFromCSV } from './src/js/data/data_reader';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const express = require('express');

const app = express();

app.set('trust proxy', true);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/get_category_data', async (req, res) => {
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

// Put all API endpoints under '/api'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App listening on ${port}`);
