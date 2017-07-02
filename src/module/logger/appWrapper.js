import logger from './index';

export default function wrap(app) {
  app.context.logger = logger;

  app.on('error', (e) => {
    logger.error(e);
  });
  process.on('uncaughtException', (err) => {
    logger.debug('†...†...†');
    logger.error(err);
  });
  process.on('unhandledRejection', (reason) => {
    logger.debug('Unhandled rejection');
    logger.error(reason);
  });
}
