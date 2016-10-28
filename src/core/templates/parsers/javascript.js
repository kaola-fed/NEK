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
    const out = js_beautify(content, { indent_size: 2 });
    return out;
  }

  async writePage() {
    const meta = this.meta;
    meta.modules = this.modules;
    meta.modals = this.modals;
    const merged = { ...meta, ...conf, isPage: true };
    const rst = this.renderFn(merged);
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
      const rst = this.renderFn(merged);
      const out = path.join(conf.jsRoot, meta.pageName, 'modules', name);

      this._writeFile(out, 'index.js', rst);
    });
  }

  async writeModals() {
    const modals = this.modals;
    const modules = this.modules;
    const meta = this.meta;

    modules.forEach((mod) => {
      const { rows } = mod;
      modals.push(...this.customs(rows, true));
    });

    modals.forEach((modal) => {
      const { name } = modal;
      const merged = { ...conf, isModal: true };
      const rst = this.renderFn(merged);

      const out = path.join(conf.jsRoot, meta.pageName, 'modals', name);
      this._writeFile(out, 'index.js', rst);
    });
  }
}

export default JavascriptParser;
