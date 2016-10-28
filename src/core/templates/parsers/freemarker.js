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

  async writePage() {
    const meta = this.meta;
    const rst = this.renderFn(meta);
    const url = meta.pageName;
    const pos = url.lastIndexOf('/');
    const out = path.join(conf.viewRoot, url.substring(0, pos));
    const name = url.substring(pos + 1);

    this._writeFile(out, `${name}.ftl`, rst);
  }
}

export default FreeMarkerParser;
