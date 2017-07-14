// https://github.com/brianc/node-postgres
// https://github.com/brianc/node-postgres/wiki/Example
// 3rd
import { extend, parseUrl } from 'pg-extra';
import pg from 'pg';
import config from '../../config/config';
import logger from '../logger';

const pgExtra = extend(pg);
// =========================================================
// const url = 'postgres://darmikon:postgres-hero@localhost:5432/test2';
// const pool = new pgExtra.Pool(parseUrl(url));
const pool = new pgExtra.Pool(config.postgres);

pool.on('error', (error, client) => {
  // handle this in the same way you would treat process.on('uncaughtException')
  // it is supplied the error as well as the idle client which received the error
  logger.error(error);
});

// pool.on('connect', (client) => {
//   console.log('connect');
// });

export default pool;
