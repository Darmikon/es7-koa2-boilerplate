import convert from 'koa-convert';
import mount from 'koa-mount';
import serve from 'koa-static';
import views from 'koa-views';
import path from 'path';
import lodashString from 'lodash/string';
import cors from 'kcors';
import koaQueryParams from 'koa-qs';
import config from './config';
import gzip from '../middleware/gzip';

export default function middleware(app) {
  app.use(cors({ credentials: true }));
  // ctx.query will now work with real object not flat
  // http://localhost:7000/?address=1&var1=1&var2=2&var[0]=1&var[1]=2&obj[key]=1
  koaQueryParams(app);

  app.use(gzip());
// static
  app.use(convert(mount('/static', serve(path.resolve(process.cwd(), 'static')))));
  app.use(convert(mount('/', serve(path.resolve(process.cwd(), 'static')))));
// app.use(convert(mount('/public', serve(`${process.cwd()}/public`))));

// views
  app.use(views(path.resolve(config.app.root, 'views'), {
    map: { hbs: 'handlebars' },
    options: {
      helpers: { ...lodashString },
      partials: {
        footer: './partials/footer',
      },
    } }));
}
