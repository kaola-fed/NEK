import path from 'path';
import { js_beautify } from 'js-beautify';

import BaseParser from './base';
import conf from '../../util/rc';
import Url2Path from '../../util/url2path';

class JavascriptParser extends BaseParser {
  constructor(meta) {
    super(meta);
    this.template = meta.templates.javascript;
    this.jsPath = Url2Path.js(meta.url);
  }

  format(content) {
    let out = js_beautify(content, { indent_size: 4 });
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
    const out = path.join(conf.jsRoot, this.jsPath, 'modules');

    this._writeFile(out, 'page.js', rst);
  }

  async writeModules() {
    const modules = this.modules;

    modules.forEach((mod) => {
      const { name } = mod;
      const cloneConf = { ...conf, name: '' };
      const merged = { ...cloneConf, ...mod };
      const rst = this.renderFn(merged);
      const out = path.join(conf.jsRoot, this.jsPath, 'modules', name);

      this._writeFile(out, 'index.js', rst);
    });
  }

  async writeModals() {
    const modals = this.modals;

    modals.forEach((modal) => {
      const { name } = modal;
      const cloneConf = { ...conf, name: '' };
      const rst = this.renderFn({ ...cloneConf, isModal: true });

      const out = path.join(conf.jsRoot, this.jsPath, 'modals', name);
      this._writeFile(out, 'index.js', rst);
    });
  }
}

export default JavascriptParser;
