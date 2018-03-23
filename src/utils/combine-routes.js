import compose from 'koa-compose';
import Boom from 'boom';

//based on https://github.com/saadq/koa-combine-routers/
/**
 * @function combineRouters
 * @description
 * Compose multiple instances of koa-router
 * into a single `use`-able middleware.
 *
 * @param  {Array | ...Object} routers koa-router instance
 * @return {middleware}
 */
export default function combineRouters(routers) {
  let middlewares = [];

  if (!Array.isArray(routers)) {
    // eslint-disable-next-line prefer-rest-params, no-param-reassign
    routers = Array.prototype.slice.call(arguments);
  }

  routers.forEach((router) => {
    middlewares.push(router.routes());
    middlewares.push(router.allowedMethods({
      throw: false,
      // eslint-disable-next-line new-cap
      notImplemented: () => new Boom.notImplemented(),
      // eslint-disable-next-line new-cap
      methodNotAllowed: () => new Boom.methodNotAllowed()
    }));
  });

  return compose(middlewares);
}
