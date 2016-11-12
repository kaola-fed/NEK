/**
 * url与文件输出路径对应规则;
 * 规则详情参考:http://dwz.cn/4zmWNf
 */
import URL from 'url';
import decamelize from 'decamelize';

export default {
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
