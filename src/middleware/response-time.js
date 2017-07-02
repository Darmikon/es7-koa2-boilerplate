import config from '../config/config';

/**
 * @function responseTime
 * @description
 * It adds X-Response-Time header to response
 * */
export default async function responseTime(ctx, next) {
  if (config.app.env === 'development') {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  } else {
    await next();
  }
}
