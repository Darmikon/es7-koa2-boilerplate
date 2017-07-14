import { bodyParser, betterBody, body } from '../module/parsers';
import ApiRouter from '../module/api-router';
import { sql } from 'pg-extra';
import pool from '../module/db/pg';

export default ApiRouter({
  prefix: '/mock'
})
  .get('/', get)
  // .post('/', bodyParser({ extendTypes: { json: ['text/plain'] } }), post);
  // .post('/', betterBody(), post)
  .post('/', body(), post)
  .get('/pg', pg);
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

async function pg(ctx) {
  try {
    ctx.body = await pool.many(sql`
      SELECT * FROM todo.users
    `);
  } catch (e) {
    ctx.body = e;
  }
}
