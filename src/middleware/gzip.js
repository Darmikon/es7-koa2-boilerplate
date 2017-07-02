//https://github.com/koajs/compress
//https://habrahabr.ru/post/221849/
//gzip compressor
//images and pdf shouldn't be gzipped http://webmasters.stackexchange.com/questions/8382/gzipped-images-is-it-worth
import compress from 'koa-compress';
import config from '../config/config';

export default function gzip() {
  const types = config.app.gzip.join('|');
  const re = new RegExp(types, 'i');

  return compress({
    threshold: 256, //don't compress files lower then this number in bytes
    filter: (contentType) => {
      // console.log(re, contentType);
      return re.test(contentType);
    },
    // flush: require('zlib').Z_SYNC_FLUSH
  });

  // to see the size of gzip compression use Telerik Fiddler Web Debugger - it shows body size
  // return compress({
  //   filter(content_type) {
  //     return /text/i.test(content_type);
  //   },
  //   threshold: 2048,
  //   flush: require('zlib').Z_SYNC_FLUSH
  // });
}
