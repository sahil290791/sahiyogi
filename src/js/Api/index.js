import { makeGetRequest } from './api';
import config from '../../../config';

const {
  FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET, COVID_ORG_URL,
  NODE_API_URL, PINCODE_API_URL
} = config;
// const FOURSQUARE_CLIENT_SECRET = 'HRDKFPHCHB3VXRKAKZEI0UJBDTKTGPJKJ1VKG3VR11MSI2OI';
// const FOURSQUARE_CLIENT_ID = 'G32Z1SB20LPG1UJRLBQV1PKXKTAQV0WIJS50A2F3BD4CKVHN';

const getDataFromLatLang = (lat, lang, options) => {
  makeGetRequest({
    url: `https://api.foursquare.com/v2/venues/search?ll=${lat},${lang}&radius=250&client_secret=${FOURSQUARE_CLIENT_SECRET}&client_id=${FOURSQUARE_CLIENT_ID}&v=20160623`,
    ...options,
  });
};

const getCityFromPinCode = (pincode, options) => {
  makeGetRequest({
    url: `${PINCODE_API_URL}/api/pincode/${pincode}`,
    withCredentials: false,
    ...options
  });
};

const getLabsForAState = (state, options) => {
  makeGetRequest({
    url: `${COVID_ORG_URL}/v1/labs`,
    withCredentials: false,
    showAllowOrigin: false,
    key: 'getLabsForAState',
    ...options
  });
};

const getZoneColor = (placeData, options) => {
  makeGetRequest({
    url: `${COVID_ORG_URL}/v1/zone?district_name=${placeData.city}&state_name=${placeData.state}`,
    withCredentials: false,
    showAllowOrigin: false,
    key: 'getZoneColor',
    ...options,
  });
};

const getActivityData = (zone, options) => {
  makeGetRequest({
    url: `${COVID_ORG_URL}/v1/activities?zone=${zone}`,
    withCredentials: false,
    showAllowOrigin: false,
    key: 'getActivityData',
    ...options,
  });
};

const getStateHelplineDetails = (state, options) => {
  makeGetRequest({
    url: `${NODE_API_URL}/get_state_wise_helpline_data?state=${state}`,
    withCredentials: false,
    showAllowOrigin: false,
    key: 'getStateHelplineDetails',
    ...options,
  });
};

export {
  getDataFromLatLang,
  getActivityData,
  getZoneColor,
  getCityFromPinCode,
  getStateHelplineDetails,
  getLabsForAState
};
