const request = require('request-promise');
const path = require('path');

const RouteDirective = require('./directives/route');
const TemplateFactory = require('./templates/factory');
const rc = require('./util/rc');
const log = require('./util/log');

/**
 * Builder类
 * @param key {String} - 工程+页面的唯一标识
 * @param meta {Object} - 从远端获取到的页面配置对象, 包括js, html, ftl等文件的模板路径
 */
class Builder {
  constructor(key = '', force = false) {
    this.key = key;
    this.force = force;
    this.meta = null;
    this.options = {};
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
    const mokyPath = path.resolve(cwd, rc.urlMaps || 'moky.config.js');

    const directive = new RouteDirective(mokyPath, url);
    directive.update();
  }

  async getMeta(url = '') {
    try {
      log.cyan('开始获取项目模板文件...');
      const project = await request(`${rc.api}/project?project=${rc.projectId}`, { json: true });
      const templates = project.templates.reduce((r, d) => {
        r[d.type] = `${rc.api}/template?file=${d.file}&name=${d.name}`;
        return r;
      }, {});

      let page = {};
      if (this.key) {
        log.cyan('开始获取页面配置数据...');
        page = await request(`${rc.api}/page?project=${rc.projectId}&page=${this.key}`, { json: true });
      }
      this.meta = Object.assign({
        url,
        data: {
          rows: [],
        },
        templates,
        options: this.options,
      }, page);
    } catch (err) {
      log.red(err);
      log.red('请求页面数据失败,请检查网络...');
      process.exit(1);
    }
  }

  render() {
    ['entry', 'freemarker', 'javascript', 'html'].forEach((type) => {
      const parser = TemplateFactory.create(type, this.meta, this.force);
      parser.parse();
    }, this);
  }
}

module.exports = Builder;
