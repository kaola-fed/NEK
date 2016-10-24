/**
 * 每个parser需要生成page.[ext]和子模块modules下的[name]/index.[ext];
 * 所以需要解析两遍json,一遍用于生成page.[ext], 一遍用于生成modules下的[name]/index.[ext]
 */
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import Handlebars from 'handlebars';
import helpers from '../../util/helpers';

class BaseParser {
  constructor(meta, modules, modals, template) {
    this.meta = meta;
    this._modules = modules;
    this._modals = modals;
    this.template = template;

    helpers(Handlebars);
  }

  set modules(modules) {
    this._modules = modules;
  }

  get modules() {
    if (this._modules) return this._modules;
    if (!this.meta) return null;
    const { rows } = this.meta;
    return this.customs(rows, false);
  }

  set modals(modals) {
    this._modals = modals;
  }

  get modals() {
    if (this._modals) return this._modals;
    if (!this.meta) return null;
    const { rows } = this.meta;
    return this.customs(rows, true);
  }

  customs(rows, flag) {
    const array = [];
    rows.forEach((row) => {
      const { components } = row;
      array.push(...components.filter(component => component.id === 0 && component.modal === flag));
    });
    return array;
  }

  format(content) { return content; }

  async _writeFile(out, filename, content) {
    await mkdirp(out);
    fs.writeFile(path.join(out, filename), this.format(content));
  }

  async loadTemplate() {
    const cwd = process.cwd();
    const source = fs.readFileSync(path.join(cwd, this.templatePath), 'utf-8');
    const template = Handlebars.compile(source, { noEscape: true });

    this.template = template;
  }

  parse(meta) {
    this.meta = meta;
    this.loadTemplate();

    if (this.writePage) this.writePage();
    if (this.writeModules) this.writeModules();
  }

}

export default BaseParser;
