import Router from 'koa-router';

class ApiRouter extends Router {
  constructor(opts = {}) {
    // eslint-disable-next-line no-param-reassign
    opts.prefix = `/api${opts.prefix ? opts.prefix : ''}`;
    super(opts);
  }
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
export default new Proxy(ApiRouter, {
  // target = ApiRouter
  apply(Target, thisArg, args) {
    return new Target(...args);
  }
});
