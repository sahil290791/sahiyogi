import models, { connectDb } from './src/js/models/index';
import { readCSV, udpateFromCSV } from './src/js/data/data_reader';

const express = require('express');
const path = require('path');

const app = express();

const eraseDatabaseOnSync = true;

// const createActivities = async () => {
//   models.CovidActivities.deleteMany({}),
//
//   await user1.save();
// };

app.set('trust proxy', true);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/get_category_data', async (req, res) => {
  console.log('got request');
  const results = await readCSV();
  res.send({ data: results });
});

app.get('/refresh_covid_activities', async (req, res) => {
  console.log('hit url');
  try {
    await udpateFromCSV(models.CovidActivities);
    res.send({ message: 'ok' });
  } catch (e) {
    console.log(e);
  }
});

// Put all API endpoints under '/api'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
// connectDb().then(async () => {
//   if (eraseDatabaseOnSync) {
//     await Promise.all([
//       models.CovidActivities.deleteMany({}),
//     ]);
//   }
//
//
// });

console.log(`App listening on ${port}`);
