import winston from 'winston';
import moment from 'moment';
import PrettyError from 'pretty-error';
import chalk from 'chalk';

const ENV = process.env.NODE_ENV; //because we don't have app.get('env') here;
const GLOBAL_LOG_LEVEL = ENV === 'development' ? 'debug' : 'error';
const LOG_LEVELS = {
  error: 0, //'red'
  row: 0, //to write entire stacktrace
  warn: 1, //'yellow'
  help: 2, //'cyan'
  data: 3, //'grey'
  info: 4, //'green'
  debug: 5, //'blue'
  prompt: 6, //'grey'
  verbose: 7, //'cyan'
  input: 8, //'grey'
  silly: 9, //'magenta'
};

const pe = new PrettyError();
const logWinstonConsole = getConsoleLogger();
const logWinstonFile = getFileLogger();
const logWinstonFileForException = getFileLoggerForException();

pe.skipNodeFiles(); // this will skip events.js and http.js and similar core node files
// pe.skipPath('/[2-routing]/[regenerator-runtime]/runtime.js');
pe.skipPackage('koa-router', 'koa-compose', 'co', 'core-js', 'babel-runtime', 'regenerator-runtime', 'babel-register');

export default {
  // levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
  log: wrap('log'), //it's extended variant and it can take 1-st argument 'method'
  error: wrap('error'), //this method call log with level 'error' automatically
  warn: wrap('warn'),
  info: wrap('info'),
  verbose: wrap('verbose'),
  debug: wrap('debug'),
  silly: wrap('silly'),
  help: wrap('help'),
  data: wrap('data'),
  prompt: wrap('prompt'),
  input: wrap('input'),
  row: wrap('row') //special case to show row stracktrace
};

function wrap(method) {
  return (...args) => {
    return logTo(method, ...args);
  };
}

function logTo(method, ...args) {
  logToConsole(method, ...args);
  logToFile(method, ...args);
}

function logToConsole(method, ...args) {
  let argsForConsole = [],
    matchError = false;

  if (method !== 'row') {
    args.forEach((arg, i) => {
      if (arg instanceof Error) {
        const prefix = '____________________exception_______________________',
          sufix = '_______________________//___________________________';
        argsForConsole.push(`${prefix} ${pe.render(arg)} ${sufix}`);
        matchError = true;
      } else if (matchError && {}.toString.call(arg).slice(8, -1) === 'Object') {
        //remove other objects from args in case we have Error.
      } else {
        argsForConsole.push(arg);
      }
    });
  } else {
    argsForConsole = [].concat(args);
    method = 'error';
  }

  if (method === 'debug') {
    logWinstonConsole[method](...argsForConsole, chalk.grey(_getCallerFile()));
  } else {
    logWinstonConsole[method](...argsForConsole);
  }

}

function logToFile(method, ...args) {
  let argsForFile = [],
    matchError = false,
    err,
    ctx,
    fuckinHackingConfig = {
      matchError: false,
      err: null,
      ctx: null
    };

  if (method !== 'row') {
    args.forEach((arg, i) => {
      if (arg instanceof Error) {
        matchError = true;
        err = arg;
        ctx = args[i + 1] || {};
        const error = Object.assign(
          {}
          , ctx.request && { ctx: ctx.request.ctx }
          , {
            stack: pe.render(err)
              .replace(/\u001b\[(?:\d+)m/g, ''),
            message: err.message
          }
        );
        argsForFile.push(error);
      } else if (matchError && Object.prototype.toString.call(arg).slice(8, -1) === 'Object') {
        //remove excessive information from stacktrace in case we have Error.
      } else {
        argsForFile.push(arg);
      }
    });
  } else {
    argsForFile = [].concat(args);
    method = 'error';
  }

  if (matchError) {
    if (LOG_LEVELS[method] < 1) {
      console.log(chalk.gray('LOGGED TO: _____________EXCEPTION_FILE__________________'));
    }
    logWinstonFileForException[method](...argsForFile);
  } else {
    //often errors such as warn: POST /users 405 Method Not Allowed 4ms
    //will be here, but as we have warn level of 405 it will not be printed to file
    if (LOG_LEVELS[method] < 1) {
      console.log(chalk.gray('LOGGED TO: _____________ERROR_FILE__________________'));
    }
    logWinstonFile[method](...argsForFile);
  }
}

function getConsoleLogger() {
  return new winston.Logger({
    transports: [
      //write everything in development mode and errors only in production mode
      new winston.transports.Console({
        colorize: true,
        level: GLOBAL_LOG_LEVEL //to see debug information NODE_ENV=development
      })
    ],
    exitOnError: false
  });
}

function getFileLogger() {
  //write only critical errors
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'errors_winston',
        filename: './logs/errors_winston.log',
        level: 'error',
        timestamp: () => moment().format('DD.MM.YYYY HH:mm:ss Z'),
        maxsize: 1000000, //1mb
        maxFiles: 5,
        // , label: path
        prettyPrint: false,
        json: false,
        silent: false,
        formatter,
      })
    ],
    exceptionHandlers: [
      new winston.transports.Console({
        colorize: true,
        level: 'error',
        timestamp: () => moment().format('DD.MM.YYYY HH:mm:ss Z'),
        formatter,
      })
    ],
    exitOnError: false
  });
}

function getFileLoggerForException() {
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'exceptions_winston',
        filename: './logs/exceptions_winston.log',
        timestamp: () => moment().format('DD.MM.YYYY HH:mm:ss Z'),
        maxsize: 1000000, //1mb
        level: 'error',
        handleExceptions: true,
        json: false,
        humanReadableUnhandledException: false,
        formatter,
      })
    ],
    exitOnError: false
  });
}

function formatter(options) {
  // Return string will be passed to logger.
  return `${moment().format('HH:mm:ss')} ${options.level.toUpperCase()}` +
    `${options.message
      ? options.message
        .replace(/\u001b\[(?:\d+)m/g, '')
      : ''
    }` +
    `${options.meta && Object.keys(options.meta).length && options.meta.trace && options.meta.trace[0]
    ? `\n\t${options.meta.trace[0].file} on line ${options.meta.trace[0].line}`
    : (options.meta && options.meta.stack
        ? options.meta.stack
        : '')}`;
}

function _getCallerFile() {
  let originalFunc = Error.prepareStackTrace;
  let callerfile;
  try {
    let err = new Error();
    let currentfile;
    Error.prepareStackTrace = function (err, stack) { return stack; };
    currentfile = err.stack.shift().getFileName();
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();
      if (currentfile !== callerfile) break;
    }
  } catch (e) {}
  Error.prepareStackTrace = originalFunc;
  return callerfile;
}
