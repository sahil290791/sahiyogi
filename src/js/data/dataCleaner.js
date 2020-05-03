import _ from 'lodash';

const removeTrailingSpace = (string) => {
  if (typeof string === 'string') {
    return string.replace(/\s+$/, '');
  }
  return string;
};

export const dataCleaner = (array) => (
  _.map(array, (item) => {
    const keys = Object.keys(item);
    const newItem = {};
    _.each(keys, (key) => {
      newItem[[removeTrailingSpace(key)]] = removeTrailingSpace(item[key]);
    });
    return newItem;
  })
);
