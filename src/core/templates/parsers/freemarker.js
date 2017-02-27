const path = require('path');

const BaseParser = require('./base');
const conf = require('../../util/rc');
const Url2Path = require('../../util/url2path');

class FreeMarkerParser extends BaseParser {
  constructor(meta, force) {
    super(meta, force);
    this.template = meta.templates.freemarker;
    this.pagePath = Url2Path.ftl(meta.url);
  }

  format(content) {
    return content;
  }

  async writePage() {
    const meta = this.meta;
    const rst = this.renderFn(Object.assign({}, meta, { pageName: Url2Path.js(meta.url) }));

    const ftlPath = this.pagePath;
    const out = path.join(conf.pageRoot, ftlPath.path);

    this._writeFile(out, `${ftlPath.name}.ftl`, rst);
  }
}

module.exports = FreeMarkerParser;
