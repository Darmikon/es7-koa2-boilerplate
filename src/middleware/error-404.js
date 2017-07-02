import errorDecorator from '../utils/error-decorator';

export default async function error404(ctx, next) {
  try {
    await next();
    // Handle 404 upstream.
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    //MANUAL MODE - ctx.throw(404, 'custom) from controller
    if (err.status === 404) {
      errorDecorator(ctx, 404, err);
      return;
    }
    //if not 404 then throw it further
    throw err;
  }
}
