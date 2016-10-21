import request from 'request-promise';

import TemplateFactory from './templates/factory';
/**
 * Builder类
 * @param key {String} - 工程+页面的唯一标识
 * @param json {Object} - 从远端获取到的页面配置对象;
 */
class Builder {
  constructor(key) {
    this.key = key;
    this.json = null;
  }

  /**
   * 步骤:
   * 1. 从远端根据用户输入的k参数获取页面json配置;
   * 2. 从远端根据k参数去取模板库;
   * 3. 取完后根据json配置输出代码;
   */
  async run() {
    await this.getJson();
    this.render();
  }

  async getJson() {
    const resp = await request('https://jsonplaceholder.typicode.com/posts/1');

    if (resp.code !== 200) { throw new Error(`[error] - ${resp.message}`); }

    this.json = resp.json || {};
  }

  render() {
    ['freemarker', 'javascript', 'html'].forEach((template) => {
      const parser = TemplateFactory.create(template);
      parser.json = this.json;
      parser.path = '';
    }, this);
  }
}

export default Builder;
