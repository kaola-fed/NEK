const path = require('path');
const { js_beautify } = require('js-beautify');

const BaseParser = require('./base');
const conf = require('../../util/rc');
const Url2Path = require('../../util/url2path');

/**
 * 页面nej入口文件entry.js解析
 */
class EntryParser extends BaseParser {
  constructor(meta, force) {
    super(meta, force);
    this.template = meta.templates.entry;

    this.entryPath = Url2Path.js(meta.url);
  }

  format(content) {
    const out = js_beautify(content, { indent_size: 4 });
    return out;
  }

  async writePage() {
    const meta = this.meta;
    const merged = Object.assign({}, meta, conf);
    const rst = this.renderFn(merged);

    const out = path.join(conf.jsRoot, this.entryPath);
    this._writeFile(out, 'entry.js', rst);
  }
}

module.exports = EntryParser;
