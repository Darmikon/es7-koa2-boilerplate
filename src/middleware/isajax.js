export default async function isajax(ctx, next) {
  ctx.state.xhr = ctx.request.get('X-Requested-With') === 'XMLHttpRequest'
    || ctx.request.headers.accept.indexOf('json') > -1;
  return next();
}
// app.use(async (ctx) => {
//   if (ctx.state.xhr) {
//     // Ajax request.
//   } else  {
//     // Not ajax request.
//   }
// });
