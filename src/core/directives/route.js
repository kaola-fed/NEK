import { js_beautify } from 'js-beautify';
import path from 'path';

import BaseDirective from './base';
import Url2Path from '../util/url2path';
import rc from '../util/rc';

class RouteDirective extends BaseDirective {
  constructor(filePath, url) {
    super(filePath);

    this.directive =
        /(\/\*\s*nek\s*route\s*:\s*start\s*\*\/)([\s\S]*)(\/\*\s*nek\s*route\s*:end\s*\*\/)/g;

    this.pathname = Url2Path.pathname(url);
    let ftlPath = Url2Path.ftl(url);
    ftlPath = `/${ftlPath.path}/${ftlPath.name}`;
    ftlPath = path.join(rc.pageRootName, ftlPath);
    this.route = `'${this.pathname}': '${ftlPath}'`;
  }

  validate(routes) {
    let pathname = this.pathname;
    pathname = pathname.replace(/\//gim, '\\/');
    /* eslint no-useless-escape:0 */
    const regexp = new RegExp(`${pathname}['|"]\s*:`, 'gim');
    return !regexp.test(routes);
  }

  update() {
    if (!this.content) { return console.warn('未找到moky的配置文件,请自行添加路由'); }
    const match = this.directive.exec(this.content);
    if (!match || !match[2]) { return console.warn('未找到<nek route>指令,请自行添加路由'); }

    const routes = match[2].split(',');

    /* 检查是否路由已经存在 */
    if (!this.validate(match[2])) { return console.error(`发现重复路由 - ${this.route}`); }

    /* 如果最后一条路由后有逗号, 就先去掉逗号 */
    if (routes[routes.length - 1].trim() === '') { routes.pop(); }
    routes.push(this.route);

    const source = this.content.replace(this.directive, `$1${routes.join(',')},\n$3`);
    const out = js_beautify(source, { indent_size: 2, max_preserve_newline: 0 });
    this.writeFile(out);

    console.log(`新增路由成功 - ${this.route}`);
  }
}

export default RouteDirective;
