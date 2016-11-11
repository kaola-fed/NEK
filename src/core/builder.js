import request from 'request-promise';
import path from 'path';

import RouteDirective from './directives/route';
import TemplateFactory from './templates/factory';
/**
 * Builder类
 * @param key {String} - 工程+页面的唯一标识
 * @param meta {Object} - 从远端获取到的页面配置对象, 包括js, html, ftl等文件的模板路径
 */
class Builder {
  constructor(key) {
    this.key = key;
    this.meta = null;
  }

  /**
   * 步骤:
   * 1. 从远端根据用户输入的k参数获取页面meta配置, meta中包含模板库的访问url;
   * 3. 取完后根据meta配置输出代码;
   */
  async run(url) {
    await this.getMeta(url);

    this.updateRoute();
    this.render();
  }

  async updateRoute() {
    const { url } = this.meta;
    const cwd = process.cwd();
    const mokyPath = path.join(cwd, 'moky.config.js');

    const directive = new RouteDirective(mokyPath, url);
    directive.update();
  }

  async getMeta(url) {
    console.log('开始获取页面配置数据...');
    try {
      const resp = await request('http://nek.kaolafed.com/project/haitao/meta.json', { json: true });

      if (resp.code !== 200) { throw new Error(`[error] - ${resp.message}`); }

      if (url) {
        this.meta = {
          url,
          rows: [],
          templates: resp.meta.templates,
        };
      } else {
        this.meta = resp.meta || {};
      }
    } catch (err) {
      console.error('请求页面数据失败,请检查网络...');
      process.exit(1);
    }
  }

  render() {
    ['entry', 'freemarker', 'javascript', 'html'].forEach((type) => {
      const parser = TemplateFactory.create(type, this.meta);
      parser.parse();
    }, this);
  }
}

export default Builder;
