import { makeGetRequest } from './api';

const getDataFromPincode = (pincode) => {
  makeGetRequest({
    url: `https://someurl?query=${pincode}`
  });
};

export {
  getDataFromPincode
};
