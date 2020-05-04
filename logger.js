import winston from 'winston';
import _ from 'lodash-deep';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'log/server.log' }),
    new (winston.transports.Console)
  ]
});

logger.filters.push((level, msg, meta) => {
  const filteredKeys = ['access_token', 'password'];
  const regex = new RegExp(filteredKeys.join('|'));
  msg = msg.replace(regex, '******');
  meta = _.deepMapValues(meta, (value, path) => {
    return regex.test(path) ? 'FILTERED' : value;
  });

  return { msg, meta };
});

module.exports = logger;
