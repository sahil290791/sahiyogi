
const makeRequest = (options) => {
  window.$.ajax({
    url: options.url,
    method: options.method,
    dataType: 'json',
    success: (data) => {
      options.cb(data);
    },
    error: (data) => {
      if (options.onError) {
        options.onError();
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('error', data);
      }
    }
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
