// etag works together with conditional-get
// cache works strange with authorized urls - even after logout browser takes pages from cache
// import conditional from 'koa-conditional-get';
// import etag from 'koa-etag';
// app.use(conditional());
// app.use(etag());

//http://stackoverflow.com/a/30453242
export default async function nocache(ctx, next) {
  //skip descending flow
  await next();

  //and on ascending flow
  ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  ctx.set('Expires', '-1');
  ctx.set('Pragma', 'no-cache');
}
