/*
* https://github.com/koajs/bodyparser
* https://github.com/tunnckocore/koa-better-body
* https://github.com/dlau/koa-body
* */
import koaBodyParser from 'koa-bodyparser';
import koaBetterBody from 'koa-better-body';
import koaBody from 'koa-body';
import convert from 'koa-convert';

/*
* the parsed body will store in ctx.request.body
* if nothing was parsed, body will be an empty object {}
* router.get('/', bodyParser(), async ctx => {
*     ctx.body = ctx.request.body;
* });
* */
export function bodyParser(options) {
  return koaBodyParser({
    // to reproduce error - just send plain text on json api endpoint
    onerror: (err, ctx) => ctx.throw(422),
    ...options,
  });
}

export function betterBody(options) {
  return convert(koaBetterBody({
    // don't know how to reproduce only throw from controller manually maybe
    onerror: (err, ctx) => ctx.throw(422),
    ...options,
  }));
}

export function body(options) {
  return convert(koaBody({
    onError: (err, ctx) => ctx.throw(422),
    ...options,
  }));
}
