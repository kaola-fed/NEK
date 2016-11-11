import path from 'path';
import { js_beautify } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';
import Url2Path from '../../util/url2path';

/**
 * 页面nej入口文件entry.js解析
 */
class EntryParser extends BaseParser {
  constructor(meta) {
    super(meta);
    this.templateUrl = meta.templates.entry;
    this.pageUrl = meta.url;
  }

  format(content) {
    const out = js_beautify(content, { indent_size: 2 });
    return out;
  }

  async writePage() {
    const meta = this.meta;
    const merged = { ...meta, ...conf };
    const rst = this.renderFn(merged);

    const out = path.join(conf.jsRoot, Url2Path.js(this.pageUrl));
    this._writeFile(out, 'entry.js', rst);
  }
}

export default EntryParser;
