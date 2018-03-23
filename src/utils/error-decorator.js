import Boom from 'boom';

export default function (ctx, code, err) {
  if (!err) {
    err = new Error();
  }
  let { headers, payload } = (err.isBoom ? err : Boom.boomify(err, { statusCode: code })).output;

  payload.message = err.message || payload.message;
  //https://gist.github.com/charlesdaniel/1686663
  // ctx.set('WWW-Authenticate', 'Basic realm="Secure Area"');
  // ctx.body = Boom.unauthorized('Wrong password');
  Object.keys(headers).forEach(key => ctx.set(key, headers[key]));
  ctx.status = code;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
    // ctx.type = 'html';
    // ctx.body = `<p>${this.status} ${codes[this.status]}</p>`;
      ctx.body = payload;
      break;
    case 'json':
      ctx.body = payload;
      break;
    default:
    // ctx.type = 'text';
      ctx.body = payload;
  }
}
