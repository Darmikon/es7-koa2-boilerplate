import Koa from 'koa';
import config from './config/config';
import base from './config/base';
import addLogger from './module/logger/appWrapper';
import logger from './module/logger';
import routes from './routes';
import middleware from './middleware';

const app = new Koa();

base(app);
addLogger(app);
app.use(middleware());
app.use(routes);

const server = app.listen(
  config.app.port,
  () => logger.info(`app is working on http://localhost:${server.address().port}`)
);
