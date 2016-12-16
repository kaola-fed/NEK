/**
 * HtmlParser的作用:
 * 1. writePage: 输出{jsRoot}/{pageName}/page.html, 其中jsRoot是从.nekrc中读取的, pageName是从meta中读取的;
 * 2. writeModules: 输出{jsRoot}/{pageName}/modules/{moduleName}/index.html, 其中moduleName是从meta中读取的;
 */
import path from 'path';
import { html } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';
import Url2Path from '../../util/url2path';

class HtmlParser extends BaseParser {
  constructor(meta, force) {
    super(meta, force);
    this.template = meta.templates.html;
    this.jsPath = Url2Path.js(meta.url);
  }

  format(content) {
    return html(content, { indent_size: 2 });
  }

  async writePage() {
    const meta = this.meta;
    meta.rows = meta.data.rows;
    const rst = this.renderFn(meta);
    const out = path.join(conf.jsRoot, this.jsPath, 'modules');

    this._writeFile(out, 'page.html', rst);
  }

  async writeModules() {
    const modules = this.modules || [];
    modules.forEach((mod) => {
      const { name } = mod;
      const rst = this.renderFn(mod);
      const out = path.join(conf.jsRoot, this.jsPath, 'modules', name);

      this._writeFile(out, 'index.html', rst);
    });
  }

  async writeModals() {
    const modals = this.modals || [];

    modals.forEach((modal) => {
      const { name } = modal;
      const rst = this.renderFn(modal);

      const out = path.join(conf.jsRoot, this.jsPath, 'modals', name);
      this._writeFile(out, 'index.html', rst);
    });
  }
}

export default HtmlParser;
