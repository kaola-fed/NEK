import path from 'path';
import { js_beautify } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';

class JavascriptParser extends BaseParser {
  constructor(meta) {
    super(meta);
    this.templateUrl = meta.templates.javascript;
  }

  format(content) {
    let out = js_beautify(content, { indent_size: 2 });
    out = out.replace(/\/\* beautify ignore:start \*\//gm, '');
    out = out.replace(/\/\* beautify ignore:end \*\//gm, '');
    out = out.replace(/^\s*[\r\n]/gm, '');
    return out;
  }

  async writePage() {
    const meta = this.meta;
    meta.modules = this.modules;
    meta.modals = this.modals;
    const merged = { ...meta, ...conf, isPage: true };
    const rst = this.renderFn(merged);
    const out = path.join(conf.jsRoot, this._getPagePath(), 'modules');

    this._writeFile(out, 'page.js', rst);
  }

  async writeModules() {
    const modules = this.modules;

    modules.forEach((mod) => {
      const { name, rows } = mod;
      const modals = { modals: this.customs(rows, true) };
      const merged = { ...mod, ...modals, ...conf };
      const rst = this.renderFn(merged);
      const out = path.join(conf.jsRoot, this._getPagePath(), 'modules', name);

      this._writeFile(out, 'index.js', rst);
    });
  }

  async writeModals() {
    const modals = this.modals;
    const modules = this.modules;

    modules.forEach((mod) => {
      const { rows } = mod;
      modals.push(...this.customs(rows, true));
    });

    modals.forEach((modal) => {
      const { name } = modal;
      const merged = { ...conf, isModal: true };
      const rst = this.renderFn(merged);

      const out = path.join(conf.jsRoot, this._getPagePath(), 'modals', name);
      this._writeFile(out, 'index.js', rst);
    });
  }
}

export default JavascriptParser;
