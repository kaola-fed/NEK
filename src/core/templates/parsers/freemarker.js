import path from 'path';

import BaseParser from './base';
import conf from '../../util/rc';

class FreeMarkerParser extends BaseParser {
  constructor(meta) {
    super(meta);
    this.templateUrl = meta.templates.freemarker;
  }

  format(content) {
    return content;
  }

  /* ftl去除第三级路径 */
  _getPagePath() {
    let pagePath = super._getPagePath();
    const pos = pagePath.lastIndexOf('/');
    const name = pagePath.substring(pos + 1);

    pagePath = pagePath.substring(0, pos);
    return {
      name,
      path: pagePath,
    };
  }

  extendMeta() {
    const meta = this.meta;
    meta.pageName = super._getPagePath();

    return meta;
  }

  async writePage() {
    const meta = this.extendMeta();

    const rst = this.renderFn(meta);

    const pagePath = this._getPagePath();
    const out = path.join(conf.viewRoot, pagePath.path);

    this._writeFile(out, `${pagePath.name}.ftl`, rst);
  }
}

export default FreeMarkerParser;
