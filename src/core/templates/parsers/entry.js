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
    this.template = meta.templates.entry;

    this.entryPath = Url2Path.js(meta.url);
  }

  format(content) {
    const out = js_beautify(content, { indent_size: 4 });
    return out;
  }

  async writePage() {
    const meta = this.meta;
    const merged = { ...meta, ...conf };
    const rst = this.renderFn(merged);

    const out = path.join(conf.jsRoot, this.entryPath);
    this._writeFile(out, 'entry.js', rst);
  }
}

export default EntryParser;
