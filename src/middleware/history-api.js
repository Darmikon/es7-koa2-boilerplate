/*
 * I will also monitor X-Requested-With:XMLHttpRequest header in addition to general workflow
 * ignoredEndpoings: ['/api'] option was added
 * */

export default function historyApiFallback(options) {
  options = options || {};
  const logger = getLogger(options);

  return async function (ctx, next) {
    const headers = ctx.request.headers;
    const reqUrl = ctx.url;
    const method = ctx.method;

    if (method !== 'GET') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the method is not GET.'
      );
      return next();
    }
    if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client did not send an HTTP accept header.'
      );
      return next();
    }
    if (headers.accept.indexOf('application/json') === 0) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client prefers JSON.'
      );
      return next();
    }

    if (!acceptsHtml(headers.accept)) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client does not accept HTML.'
      );
      return next();
    }

    if (
      ctx.request.get('X-Requested-With') === 'XMLHttpRequest' ||
      ctx.request.get('x-requested-with') === 'XMLHttpRequest'
    ) {
      return next();
    }

    const parsedUrl = {
      pathname: ctx.request.path,
      search: ctx.request.search,
      query: ctx.request.query,
      protocol: ctx.request.protocol,
      host: ctx.request.host,
      origin: ctx.request.origin,
      path: ctx.request.path,
    };
    let rewriteTarget = null;

    options.rewrites = options.rewrites || [];

    for (let i = 0; i < options.rewrites.length; i++) {
      const rewrite = options.rewrites[i];
      const match = parsedUrl.pathname.match(rewrite.from);
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to);
        logger('Rewriting', ctx.method, ctx.url, 'to', rewriteTarget);
        ctx.url = rewriteTarget;
        return next();
      }
    }

    if (parsedUrl.pathname.indexOf('.') !== -1) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the path includes a dot (.) character.'
      );
      return next();
    }

    if (Array.isArray(options.ignoredEndpoints)) {
      options.ignoredEndpoints.some((str) => {
        if (parsedUrl.pathname.indexOf(str) !== -1) {
          logger(
            'Not rewriting',
            method,
            reqUrl,
            'because it is ingored request.'
          );
          return next();
        }
      });
    }

    rewriteTarget = options.index || '/index.html';

    logger('Rewriting', method, reqUrl, 'to', rewriteTarget);

    ctx.url = rewriteTarget;

    return next();
  };

}

function evaluateRewriteRule(parsedUrl, match, rule) {
  if (typeof rule === 'string') {
    return rule;
  } else if (typeof rule !== 'function') {
    throw new Error('Rewrite rule can only be of type string of function.');
  }
  return rule({
    parsedUrl,
    match
  });
}

function acceptsHtml(header) {
  return header.indexOf('text/html') !== -1 || header.indexOf('*/*') !== -1;
}

function getLogger(options) {
  if (options && options.logger) {
    return options.logger;
  } else if (options && options.verbose) {
    return console.log.bind(console);
  }

  return function () {};
}
