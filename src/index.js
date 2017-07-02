if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  require('babel-register');
}
require('babel-polyfill');
require('./app');
