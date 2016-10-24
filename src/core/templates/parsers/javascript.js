import path from 'path';
import { js_beautify } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';

class JavascriptParser extends BaseParser {
  constructor() {
    super();
    this.templatePath = './tmp/template.js';
  }

  format(content) {
    return js_beautify(content, { indent_size: 2 });
  }

  async writePage() {
    const meta = this.meta;
    meta.modules = this.modules;
    meta.modals = this.modals;
    const rst = this.template(meta);
    const out = path.join(conf.jsRoot, meta.pageName, 'modules');

    this._writeFile(out, 'page.js', rst);
  }

  async writeModules() {
    const modules = this.modules;
    const meta = this.meta;
    modules.forEach((mod) => {
      const { name, rows } = mod;
      const modals = { modals: this.customs(rows, true) };
      const merged = { ...mod, ...modals, ...conf };
      const rst = this.template(merged);
      const out = path.join(conf.jsRoot, meta.pageName, 'modules', name);

      this._writeFile(out, 'index.js', rst);
    });
  }
}

export default JavascriptParser;
