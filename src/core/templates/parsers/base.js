/**
 * 每个parser需要生成page.[ext]和子模块modules下的[name]/index.[ext];
 * 所以需要解析两遍json,一遍用于生成page.[ext], 一遍用于生成modules下的[name]/index.[ext]
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp-promise');
const request = require('request-promise');

const Handlebars = require('handlebars');
const helpers = require('../../util/helpers');
const log = require('../../util/log');

class BaseParser {
  constructor(meta, force = false) {
    this.meta = meta;
    this.force = force;
    this._modules = null;
    this._modals = null;

    helpers(Handlebars);
  }

  set modules(modules) { this._modules = modules; }

  get modules() {
    if (this._modules) return this._modules;
    if (!this.meta) return [];
    const { rows } = this.meta.data;
    return this.getModules(rows) || [];
  }

  set modals(modals) { this._modals = modals; }

  get modals() {
    if (this._modals) return this._modals;
    if (!this.meta) return [];
    const { modals } = this.meta.data;
    return modals || [];
  }

  getModules(rows) {
    if (!rows) { return []; }

    const array = [];
    rows.forEach((row) => {
      const { components } = row;
      array.push(...components.filter(component =>
        component.id === 0
      ));
    });
    return array;
  }

  format(content) { return content; }

  async loadTemplate() {
    log.cyan(`template: ${this.template}`);
    try {
      const source = await request(this.template);
      this.renderFn = Handlebars.compile(source, { noEscape: true });
    } catch (e) {
      log.red('模板文件请求失败,请检查...');
      process.exit(1);
    }
  }

  async _writeFile(dir, filename, content) {
    const out = path.join(dir, filename);
    if (fs.existsSync(out) && !this.force) { return log.yellow(`Exist File: ${out}`); }
    if (this.force) { log.yellow(`Force write: ${out}`); }

    await mkdirp(dir);
    fs.writeFile(out, this.format(content), () => {});

    log.cyan(`Output File: ${out}`);
  }

  async parse() {
    await this.loadTemplate();

    if (this.writePage) this.writePage();
    if (this.writeModules) this.writeModules();
    if (this.writeModals) this.writeModals();
  }

}

module.exports = BaseParser;
