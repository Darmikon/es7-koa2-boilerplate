import Router from 'koa-router';

class ApiRouter extends Router {
  constructor(opts = {}) {
    opts.prefix = `/api${opts.prefix ? opts.prefix : ''}`;
    super(opts);
  }
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
export default new Proxy(ApiRouter, {
  // target = ApiRouter
  apply(target, thisArg, args) {
    return new target(...args);
  }
});
