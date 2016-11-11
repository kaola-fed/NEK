import path from 'path';

import BaseParser from './base';
import conf from '../../util/rc';
import Url2Path from '../../util/url2path';

class FreeMarkerParser extends BaseParser {
  constructor(meta) {
    super(meta);
    this.templateUrl = meta.templates.freemarker;
    this.pageUrl = meta.url;
  }

  format(content) {
    return content;
  }

  async writePage() {
    const meta = this.meta;
    const rst = this.renderFn({ ...meta, pageName: Url2Path.js(this.pageUrl) });

    const ftlPath = Url2Path.ftl(this.pageUrl);
    const out = path.join(conf.viewRoot, ftlPath.path);

    this._writeFile(out, `${ftlPath.name}.ftl`, rst);
  }
}

export default FreeMarkerParser;
