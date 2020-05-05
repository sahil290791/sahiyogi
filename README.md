# sahiyogi

### Development Setup
- Make sure that `node` version is set to `12.16.x`.
- Run the following commands to bring up the application
```shell
yarn install

# start the server
yarn dev
yarn start
```

### Production Setup
Run `yarn build` and `yarn start` to run the app

### Deployment
```
docker build . -t scripbox/sahiyogi:v0.1.5

docker push scripbox/sahiyogi:v0.1.5

gcloud beta compute instances --project "covid-lockdown-276006" update-container covidlockdownorg --container-image scripbox/sahiyogi:v0.1.5
```

### API server
##### /api/get_category_data
responsePayload
```json
{
  "data": [
    {
      "Activity Category": "Construction ",
      "Activity Subcategory": "In-Situ Construction in Urban Areas",
      "Detail": "Where workers are available on site and no workers are required to be brought in from outside",
      "Containment Zone": "N",
      "Red Zone": "Y",
      "Green Zone": "Y",
      "Orange Zone": "Y"
      },
      {
      "Activity Category": "Construction ",
      "Activity Subcategory": "Construction of renewable energy projects in Urban Areas",
      "Detail": "",
      "Containment Zone": "N",
      "Red Zone": "Y",
      "Green Zone": "Y",
      "Orange Zone": "Y"
    }
  ]
}
```

##### /api/get_state_wise_helpline_data
**?state=Assam**
responsePayload
```json
{
  "data": {
    "state": "Assam",
    "covid_helpline_numbers": ["6913347770"]
  }
}
```

**no query param**
responsePayload
```json
{
  "data": [{
      "State": "Assam",
      "Coronavirus Helpline Numbers": ["6913347770"]
    },
    {
        "state": "Karnataka",
        "covid_helpline_numbers": [
          "104",
          "080-4684 8600",
          "080-6669 2000"
          ]
    }
  ]
}
```

### Pending tasks
- [ ] Title: `Lockdown essentials`
- [ ] Desc: `Find out what's allowed and restricted in your area during the COVID-19 lockdown`
- [ ] Fetch any news related to a Pincode
- [ ] Add separate API's for zone level data
- [ ] Add filter for are you commuting
- [ ] If the pincode lies in tamil nadu add link for travel pass https://rttn.nonresidenttamil.org/
