import errorDecorator from '../utils/error-decorator';

export default async function error500(ctx, next) {
  try {
    await next();
  } catch (err) {
    errorDecorator(ctx, 500, err);
    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    ctx.app.emit('error', err, ctx);
  }
}
