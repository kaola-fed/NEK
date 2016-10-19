import request from 'request-promise';
/**
 * Builder类
 * @param key {String} - 工程+页面的唯一标识
 * @param json {Object} - 从远端获取到的页面配置对象;
 * @param templates {String} - 模板对应的路径;
 */
class Builder {
  constructor(key) {
    this.key = key;
    this.json = null;
    this.templates = null;
  }

  /**
   * 步骤:
   * 1. 从远端根据用户输入的k参数获取页面json配置;
   * 2. 判断本地是否存在模板库,如果已经存在,那么直接根据json解析模板输出代码;
   * 3. 如果不存在模板库,那么从远端根据k参数去取模板库;取完后根据json配置输出代码;
   */
  async run() {
    await this.getJson();
    await this.getTemplates();
  }

  async getJson() {
    const resp = await request('https://jsonplaceholder.typicode.com/posts/1');

    if (resp.code !== 200) { throw new Error(`[error] - ${resp.message}`); }

    this.json = resp.json || {};
  }

  async getTemplates() {
    this.templates = '';
    console.log(123);
  }
}

export default Builder;
