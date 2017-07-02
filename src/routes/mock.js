import { bodyParser, betterBody, body } from '../module/parsers';
import ApiRouter from '../module/api-router';

export default ApiRouter({
  prefix: '/mock'
})
  .get('/', get)
  // .post('/', bodyParser({ extendTypes: { json: ['text/plain'] } }), post);
  // .post('/', betterBody(), post)
  .post('/', body(), post);
  //†route

//†handler
async function get(ctx, next) {
  ctx.logger.debug('info');
  ctx.throw(404, 'custom');
  ctx.body = {
    'status': 'success'
  };
}

async function post(ctx, next) {
  ctx.logger.debug(ctx.request.fields); //koa-better-body json
  // ctx.throw(404, 'custom');
  // ctx.logger.debug(ctx.query);
  ctx.body = {
    data: ctx.request.body
  };
}
