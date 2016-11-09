/**
 * 每个parser需要生成page.[ext]和子模块modules下的[name]/index.[ext];
 * 所以需要解析两遍json,一遍用于生成page.[ext], 一遍用于生成modules下的[name]/index.[ext]
 */
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import request from 'request-promise';
import UrlApi from 'url';
import decamelize from 'decamelize';
import Handlebars from 'handlebars';
import helpers from '../../util/helpers';

class BaseParser {
  constructor(meta) {
    this.meta = meta;
    this._modules = null;
    this._modals = null;

    helpers(Handlebars);
  }

  set modules(modules) { this._modules = modules; }

  get modules() {
    if (this._modules) return this._modules;
    if (!this.meta) return null;
    const { rows } = this.meta;
    return this.customs(rows, false);
  }

  set modals(modals) { this._modals = modals; }

  get modals() {
    if (this._modals) return this._modals;
    if (!this.meta) return [];
    const { rows } = this.meta;
    return this.customs(rows, true);
  }

  customs(rows, flag) {
    if (!rows) { return []; }

    const array = [];
    rows.forEach((row) => {
      const { components } = row;
      array.push(...components.filter(component =>
        component.id === 0 && !!component.modal === flag
      ));
    });
    return array;
  }

  format(content) { return content; }

  async loadTemplate() {
    console.log(`template: ${this.templateUrl}`);
    try {
      const source = await request(this.templateUrl);
      this.renderFn = Handlebars.compile(source, { noEscape: true });
    } catch (e) {
      console.error('模板文件请求失败,请检查...');
      process.exit(1);
    }
  }

  async _writeFile(dir, filename, content) {
    const out = path.join(dir, filename);
    if (fs.existsSync(out)) { return console.warn(`Exist File: ${out}`); }

    await mkdirp(dir);
    fs.writeFile(out, this.format(content));

    console.log(`Output File: ${out}`);
  }

  _getPagePath() {
    const { url } = this.meta;

    let pathname = UrlApi.parse(url).pathname;
    pathname = pathname.replace(/(^\/?backend\/)|^\//, '');

    const pathArray = pathname.split('/');
    if (pathArray.length > 3) { throw new Error('[Error]url最多支持三级,请检查'); }

    while (pathArray.length < 3) {
      pathArray.push('index');
    }

    pathname = decamelize(pathArray.join('/'), '.');
    return pathname;
  }

  async parse() {
    await this.loadTemplate();

    if (this.writePage) this.writePage();
    if (this.writeModules) this.writeModules();
    if (this.writeModals) this.writeModals();
  }

}

export default BaseParser;
