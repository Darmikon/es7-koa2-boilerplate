import path from 'path';
import _ from '../utils/fp';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV;
const DEFAULT_PORT = 7000;
/**
 * @property {bool}  logStatic         - Log 404 errors for static files.
 * @property {bool}  logHeaders        - Log http headers to console.
 * @property {array}  gzip             - Array of file types which have to be compressed with gzip. Based on MIME types
 * @property {bool}  html5HistoryAPI   - Redirect all request accept ajax and static files to '/' index route
 */
let base = {
  app: {
    env,
    logStatic: true,
    logHeaders: false,
    root: path.resolve(__dirname, '../'),
    gzip: ['text', 'css', 'javascript'],
    html5HistoryAPI: true,
    port: process.env.PORT || DEFAULT_PORT,
  }
};


let specific = {
  development: {
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'test',
      password: 'test',
      database: 'test'
    }
  },
  production: {
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'test',
      password: 'test',
      database: 'test'
    }
  },
};

export default _.merge(specific[env])(base);
