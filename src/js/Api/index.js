import { makeGetRequest } from './api';

// const GOOGLE_API_KEY = 'AIzaSyCjt7-Mdz_jiSsXUT4-Teffc9fS3SrmVDA';
const FOURSQUARE_CLIENT_SECRET = 'HRDKFPHCHB3VXRKAKZEI0UJBDTKTGPJKJ1VKG3VR11MSI2OI';
const FOURSQUARE_CLIENT_ID = 'G32Z1SB20LPG1UJRLBQV1PKXKTAQV0WIJS50A2F3BD4CKVHN';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000';

const getDataFromLatLang = (lat, lang, options) => {
  makeGetRequest({
    url: `https://api.foursquare.com/v2/venues/search?ll=${lat},${lang}&client_secret=${FOURSQUARE_CLIENT_SECRET}&client_id=${FOURSQUARE_CLIENT_ID}&v=20160623`,
    ...options,
  });
};

const getCityFromPinCode = (pincode, options) => {
  makeGetRequest({
    url: `https://pincode.saratchandra.in/api/pincode/${pincode}`,
    withCredentials: false,
    ...options
  });
};

const getZoneColor = (placeData, options) => {
  makeGetRequest({
    url: `http://lockdown-api.scripbox.io/api/v1/zone?district_name=${placeData.city}&state_name=${placeData.state}`,
    withCredentials: false,
    showAllowOrigin: false,
    ...options,
  });
};

const getActivityData = (zone, options) => {
  makeGetRequest({
    url: `http://lockdown-api.scripbox.io/api/v1/activities?zone=${zone}`,
    withCredentials: false,
    showAllowOrigin: false,
    ...options,
  });
};

const getStateHelplineDetails = (state, options) => {
  makeGetRequest({
    url: `${API_URL}/get_state_wise_helpline_data?state=${state}`,
    withCredentials: false,
    showAllowOrigin: false,
    ...options,
  });
};

export {
  getDataFromLatLang,
  getActivityData,
  getZoneColor,
  getCityFromPinCode,
  getStateHelplineDetails,
};

// https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=711202&inputtype=textquery&fields=formatted_address,id,name,opening_hours,geometry&key=AIzaSyCjt7-Mdz_jiSsXUT4-Teffc9fS3SrmVDA
// https://maps.googleapis.com/maps/api/place/details/json?place_id=8564fbd0fb148808b9bc82bc788c7c2eb4077fe4&fields=name,rating,formatted_phone_number&key=AIzaSyCjt7-Mdz_jiSsXUT4-Teffc9fS3SrmVDA
// https://api.foursquare.com/v2/venues/search?ll=22.6322886,88.35064679999999&client_secret=HRDKFPHCHB3VXRKAKZEI0UJBDTKTGPJKJ1VKG3VR11MSI2OI&client_id=G32Z1SB20LPG1UJRLBQV1PKXKTAQV0WIJS50A2F3BD4CKVHN&v=20160623
