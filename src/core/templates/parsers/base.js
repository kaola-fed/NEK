/**
 * 每个parser需要生成page.[ext]和子模块modules下的[name]/index.[ext];
 * 所以需要解析两遍json,一遍用于生成page.[ext], 一遍用于生成modules下的[name]/index.[ext]
 */
import Handlebars from 'handlebars';
import helpers from '../../util/helpers';

class BaseParser {
  constructor(json, path) {
    this.path = path;
    this.json = json;
    this.modules = null;

    helpers(Handlebars);
  }

  set modules(modules) { this.modules = modules; }

  get modules() {
    if (this.modules) return this.modules;

    const { rows } = this.json;
    const array = [];
    rows.forEach((row) => {
      const { components } = row;
      array.push(...components.filter(component => component.id === 0));
    });
    return array;
  }

  parse() {
    this.writePage();
    this.writeModule();
  }

}

export default BaseParser;
