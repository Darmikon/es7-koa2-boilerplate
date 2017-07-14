import errorDecorator from '../utils/error-decorator';
import _ from '../utils/fp';

const ignoredErrors = _.reduce((p, n) => ({ ...p, n }))([
  404, 500,
]);

export default async function errorsCommon(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.logger.error(err)
    ctx.logger.debug(err.status);
    if (!ignoredErrors[err.status]) {
      errorDecorator(ctx, err.status, err);
      return;
    }
    //if some ignored error then throw it further
    throw err;
  }
}
