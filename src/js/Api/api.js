import axios from 'axios';
import _ from 'lodash';

axios.defaults.timeout = 30000;
const CancelToken = axios.CancelToken;

const _pendingRequests = {};

const abortPendingRequests = (key) => {
  if (_pendingRequests[key]) {
    _pendingRequests[key]('REQUEST_CANCELLED');
    _pendingRequests[key] = null;
  }
};

const isInvalidToken = (response) => {
  if (response.status !== 401) {
    return false;
  }

  const authHeader = response.headers.get('WWW-Authenticate') || '';

  return authHeader.includes('invalid_token');
};

const processResponse = (res) => {
  if (isInvalidToken(res)) {
    return { data: {} };
  }

  if (res.status === 201) {
    const response = Object.assign({}, res, { data: {} });
    return response;
  }
  return res;
};

const handleJSONResponse = (options, response, jsonResponse) => {
  const jsonRes = _.isEmpty(jsonResponse) ? {} : jsonResponse;
  const { status } = response;
  const { errors } = Object.assign({}, jsonRes);
  const resp = {
    status,
    body: jsonResponse,
    errors,
    headers: response.headers,
  };
  options.cb(resp);
};

const handleResponse = (options, response, jsonResponse) => {
  handleJSONResponse(options, response, jsonResponse);
};

const makeRequest = (options) => {
  let allowOrigin = {};
  if (options.showAllowOrigin) {
    allowOrigin = {
      'Access-Control-Allow-Origin': '*'
    };
  }
  axios({
    url: options.url,
    method: options.method,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      ...allowOrigin,
      // 'Access-Control-Allow-Origin': '*',
    },
    timeout: 30000,
    withCredentials: options.withCredentials,
    cancelToken: new CancelToken(function executor(c) {
      _pendingRequests[options.url] = c;
    }),
  })
    .then(res => processResponse(res))
    .then(res => {
      handleResponse(options, res, res.data);
    })
    .catch((err) => {
      const res = err.response;
      options.onError(err);
    });
};


const makeGetRequest = (options) => {
  makeRequest({
    ...options,
    method: 'GET',
  });
};

// const postRequest = (options) => {
//   makeRequest({
//     ...options,
//     method: 'GET',
//   });
// };

export {
  makeGetRequest, makeRequest
};
