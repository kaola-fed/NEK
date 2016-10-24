import request from 'request-promise';

import TemplateFactory from './templates/factory';
/**
 * Builder类
 * @param key {String} - 工程+页面的唯一标识
 * @param meta {Object} - 从远端获取到的页面配置对象;
 */
class Builder {
  constructor(key) {
    this.key = key;
    this.meta = null;
  }

  /**
   * 步骤:
   * 1. 从远端根据用户输入的k参数获取页面meta配置;
   * 2. 从远端根据k参数去取模板库;
   * 3. 取完后根据meta配置输出代码;
   */
  async run() {
    await this.getMeta();
    this.render();
  }

  async getMeta() {
    const resp = await request('http://127.0.0.1:3000/projects/haitao/meta.json', { json: true });

    if (resp.code !== 200) { throw new Error(`[error] - ${resp.message}`); }
    this.meta = resp.meta || {};
  }

  render() {
    ['freemarker', 'javascript', 'html'].forEach((template) => {
      const parser = TemplateFactory.create(template);
      parser.parse(this.meta);
    }, this);
  }
}

export default Builder;
