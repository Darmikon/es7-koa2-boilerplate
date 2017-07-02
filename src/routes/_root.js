import Router from 'koa-router';

export default Router({
  prefix: '/'
})
  .get('/', async (ctx, next) => {
    ctx.logger.debug('debug here>>>>>>>>>');
    ctx.logger.debug(ctx.query);
    ctx.logger.debug(ctx.querystring);
    await ctx.render('index.hbs', { user: 'WELCOME TO KOA 2' });
  });
