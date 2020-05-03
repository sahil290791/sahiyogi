# sahiyogi

### Development Setup
- Make sure that `node` version is set to `12.16.x`.
- Run the following commands to bring up the application
```shell
yarn install

# start the server
yarn dev
```

### Production Setup
Run `yarn build` and `yarn start` to run the app

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
    "State": "Assam",
    "Coronavirus Helpline Numbers": "6913347770"
  }
}
```

**no query param**
responsePayload
```json
{
  "data": [{
      "State": "Assam",
      "Coronavirus Helpline Numbers": "6913347770"
    },
    {
        "State": "Karnataka",
        "Coronavirus Helpline Numbers": "6913347770"
    }
  ]
}
```
