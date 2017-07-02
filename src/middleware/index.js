import compose from 'koa-compose';
import config from '../config/config';
import error404 from './error-404';
import error500 from './error-500';
import errors from './errors';
import requestlogger from './request-logger';
import responseTime from './response-time';
import isajax from './isajax';
import historyApi from './history-api';
import nocache from './nocache';
import identity from './identity';
// import gzip from './gzip';

export default function middleware() {
  return compose(
    [
      // gzip(), //should be in base because static server is higher the general middlewares
      isajax,
      requestlogger,
      responseTime,
      nocache,
      error500,
      errors,
      error404, //should be at the bottom of errors
      config.app.html5HistoryAPI
        ? historyApi({ index: '/', ignoredEnpoings: ['/api'] })
        : identity,
    ]
  );
}
