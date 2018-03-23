import moment from 'moment';
import chalk from 'chalk';
import config from '../config/config';

//Middleware: request logger
async function requestlogger(ctx, next) {
  let startTime = moment();
  let endTime;
  let level = 'info';
  // TODO remove if not required
  // let { staticPatterns } = config.app;
  let staticRe = new RegExp('\\.\\w+$', 'i');
  //don't log static files until they don't exist
  if (config.app.logStatic === true && staticRe.test(ctx.originalUrl)) {
    await next();
    //skip downstream
    if (ctx.status === 404) {
      //skip upstream
      ctx.logger.log(
        'warn'
        , '%s %s %s %s'
        , chalk.black.bold('FILE NOT FOUND: ')
        , chalk.black.bold(ctx.req.method)
        , chalk.black.bold(ctx.req.url) //ctx.originalUrl
        // , chalk.gray(moment().format('HH:mm:ss'))
        , chalk[ctx.res.statusCode >= 400 ? 'red' : 'green'](`${ctx.res.statusCode} ${ctx.res.statusMessage}`)
      );
    }
  } else {
    //log request
    ctx.logger.log(
      level
      , '%s %s %s %s'
      , chalk.black.bold('REQUEST: ')
      , chalk.black.bold(ctx.req.method)
      , chalk.black.bold(ctx.req.url) //ctx.originalUrl
      , chalk.gray(moment().format('HH:mm:ss'))
    );

    if (config.app.logHeaders) {
      ctx.logger.log(
        level
        , chalk.black.bold('>>>>HEADERS: ') + JSON.stringify(ctx.req.headers, null, 4)
      );
    }

    await next();

    //log response
    if (ctx.status >= 500) {
      level = 'error';
    } else if (ctx.status >= 400) {
      level = 'warn';
    } else if (ctx.status >= 100) {
      level = 'info';
    }

    endTime = moment();

    ctx.logger.log(
      level
      , '%s %s %s %s %s'
      , chalk.black.bold('RESPONSE TO: ')
      , chalk.black.bold(ctx.req.method)
      , chalk.black.bold(ctx.req.url) //ctx.originalUrl
      // , chalk.gray(moment().format('HH:mm:ss'))
      , chalk[ctx.res.statusCode >= 400 ? 'red' : 'green'](`${ctx.res.statusCode} ${ctx.res.statusMessage}`)
      , chalk.black(`${endTime.diff(startTime, 'milliseconds')}ms`)
    );

    if (config.app.logHeaders) {
      ctx.logger.log(
        level
        , chalk.black.bold('>>>>HEADERS: ') + JSON.stringify(ctx.res._headers, null, 4)
      );
    }
  }
  // console.log(ctx.res);
}

export default requestlogger;
