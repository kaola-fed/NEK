/**
 * 每个parser需要生成page.[ext]和子模块modules下的[name]/index.[ext];
 * 所以需要解析两遍json,一遍用于生成page.[ext], 一遍用于生成modules下的[name]/index.[ext]
 */
import Handlebars from 'handlebars';
import helpers from '../../util/helpers';

class BaseParser {
  constructor(meta, modules, template) {
    this.meta = meta;
    this._modules = modules;
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
    const array = [];
    rows.forEach((row) => {
      const { components } = row;
      array.push(...components.filter(component => component.id === 0));
    });
    return array;
  }

  parse(meta) {
    this.meta = meta;
    this.loadTemplate();

    this.writePage();
    this.writeModules();
  }

}

export default BaseParser;
