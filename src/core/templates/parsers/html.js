/**
 * HtmlParser的作用:
 * 1. writePage: 输出{jsRoot}/{pageName}/page.html, 其中jsRoot是从.nekrc中读取的, pageName是从meta中读取的;
 * 2. writeModules: 输出{jsRoot}/{pageName}/modules/{moduleName}/index.html, 其中moduleName是从meta中读取的;
 */
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import Handlebars from 'handlebars';
import { html } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';

class HtmlParser extends BaseParser {

  async _writeFile(out, filename, content) {
    await mkdirp(out);
    fs.writeFile(path.join(out, filename), html(content, { indent_size: 2 }));
  }

  async loadTemplate() {
    const cwd = process.cwd();
    const source = fs.readFileSync(path.join(cwd, './tmp/template.html'), 'utf-8');
    const template = Handlebars.compile(source, { noEscape: true });

    this.template = template;
  }

  async writePage() {
    const meta = this.meta;
    const rst = this.template(meta);
    const out = path.join(conf.jsRoot, meta.pageName);

    this._writeFile(out, 'page.html', rst);
  }

  async writeModules() {
    const modules = this.modules;
    modules.forEach((module) => {
      const { name } = module;
      const rst = this.template(module);
      const out = path.join(conf.jsRoot, 'modules', name);

      this._writeFile(out, 'index.html', rst);
    });
  }
}

export default HtmlParser;
