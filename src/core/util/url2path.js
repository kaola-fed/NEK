/**
 * url与文件输出路径对应规则;
 * 规则详情参考:http://dwz.cn/4zmWNf
 */
const URL = require('url');
const decamelize = require('decamelize');
const rc = require('./rc');

module.exports = {
  ftl(url) {
    let pagePath = this.js(url);
    const pos = pagePath.lastIndexOf('/');
    const name = pagePath.substring(pos + 1);

    pagePath = pagePath.substring(0, pos);
    return {
      name,
      path: pagePath,
    };
  },
  js(url) {
    if (rc.urlReplace) {
      const regexp = new RegExp(rc.urlReplace);
      url = url.replace(regexp, ''); // eslint-disable-line no-param-reassign
    }

    let pathname = this.pathname(url);

    const pathArray = pathname.split('/');
    // 去除第一个/
    pathArray.shift();

    if (pathArray.length > 3) { throw new Error('[Error]url最多支持三级,请检查'); }

    while (pathArray.length < 3) {
      pathArray.push('index');
    }

    pathname = decamelize(pathArray.join('/'), '.');
    return pathname;
  },
  pathname(url) {
    return URL.parse(url).pathname;
  },
};
