import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const readCSV = async () => {
  const results = [];
  await fs.createReadStream(path.resolve(__dirname, '..', '..', 'data', 'covid_activities.csv'))
    .pipe(csv())
    .on('data', (data) => {
      console.log(data);
      results.push(data);
    })
    .on('end', () => {
      return results;
    });
  return results;
};

const udpateFromCSV = async () => {
  const results = [];
  await fs.createReadStream(path.resolve(__dirname, '..', '..', 'data', 'covid_activities.csv'))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.each(async (data) => {
        const activity = new models.CovidActivities({
          activity: data['Activity Category'],
          subActivity: data['Activity Subcategory'],
          details: data.Detail,
          redZone: data['Red Zone'],
          greenZone: data['Green Zone'],
          orangeZone: data['Orange Zone'],
          containmentZone: data['Containment Zone'],
        });
        await activity.save();
      });
    });
};

export { readCSV, udpateFromCSV };
