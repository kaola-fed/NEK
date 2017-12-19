const request = require('request-promise');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const Handlebars = require('handlebars');
const {
  js_beautify,
  html,
} = require('js-beautify');

const RouteDirective = require('./directives/route');
const rc = require('./util/rc');
const log = require('./util/log');
const Url2Path = require('./util/url2path');

const ProjectTypes = {
  NEJ: 1,
  Webpack: 2,
  WebpackMul: 3,
};
/**
 * Server类
 * @param key {String} - 页面唯一标识
 * @param force {Boolean} - 是否强制重写文件
 * @param meta {Object} - 从Sever获取的页面配置
 */
class Server {
  constructor(key = '', force = false) {
    this.key = key;
    this.force = force;
    this.meta = null;
  }
  /**
   * 步骤：
   * 1、从Server获取页面配置，包括项目类型（新老项目、单页多页），页面url
   * 2、从Server获取代码，根据项目类型、页面url写文件
   * 3、更新路由
   */
  async run() {
    await this.getMeta();

    this.updateRoute();
    this.render();
  }

  async getMeta() {
    if (!this.key) {
      log.red('请输入页面唯一标识key...');
      process.exit(1);
    }
    try {
      log.cyan('开始获取项目页面配置数据...');
      const { data } = await request(`${rc.serverApi}/api/public/page?id=${this.key}`, {
        json: true,
      });
      this.meta = {
        url: data.url,
        type: data.type,
        ftl: data.ftl,
        entry: data.entry,
        html: data.html,
        index: data.index,
        modules: data.modules,
        modals: data.modals,
        mixins: data.mixins,
      };
    } catch (err) {
      log.red(err);
      log.red('请求页面数据失败，请检查网络...');
      process.exit(1);
    }
  }

  async updateRoute() {
    const { url, type } = this.meta;
    if (!url || !type) {
      log.red('nek server配置中缺少页面url或项目类型');
      process.exit(1);
    }
    const cwd = process.cwd();
    // type为1，是nej老项目
    if (type === ProjectTypes.NEJ) {
      const mokyPath = path.resolve(cwd, rc.urlMaps || 'moky.config.js');
      const directive = new RouteDirective(mokyPath, url);
      directive.update();
    }
  }

  async _writeFile(dir, filename, content, ext) {
    const out = path.join(dir, filename);
    if (fs.existsSync(out) && !this.force) {
      return log.yellow(`Exist File: ${out}`);
    }
    if (this.force) {
      log.yellow(`Force write: ${out}`);
    }

    await mkdirp(dir);
    fs.writeFile(out, this.format(content, ext), () => {});

    log.cyan(`Output File: ${out}`);
  }

  async writeFtl() {
    const ftlPath = Url2Path.ftl(this.meta.url);
    const out = path.join(rc.pageRoot, ftlPath.path);
    // 使用handlebars处理变量
    const template = Handlebars.compile(this.meta.ftl);
    const pageName = Url2Path.js(this.meta.url);
    const rst = template({ pageName });
    this._writeFile(out, `${ftlPath.name}.ftl`, rst);
  }

  async writeEntry() {
    const entryPath = Url2Path.js(this.meta.url);
    const out = path.join(rc.jsRoot, entryPath);
    this._writeFile(out, 'entry.js', this.meta.entry, 'js');
  }

  async writeIndex() {
    const indexPath = Url2Path.js(this.meta.url);
    const out = path.join(rc.jsRoot, indexPath);
    if (this.meta.type === ProjectTypes.NEJ) {
      this._writeFile(path.join(out, 'modules'), 'page.html', this.meta.index.html, 'html');
      this._writeFile(path.join(out, 'modules'), 'page.js', this.meta.index.js, 'js');
      this.writeMock(this.meta.index.url, this.meta.index.mock);
    } else {
      this._writeFile(out, 'index.html', this.meta.index.html, 'html');
      this._writeFile(out, 'index.js', this.meta.index.js, 'js');
    }
  }

  async writeDirs(dir) {
    const dirPath = Url2Path.js(this.meta.url);
    const out = path.join(rc.jsRoot, dirPath);
    const dirs = this.meta[dir];
    /* eslint guard-for-in: "error" */
    for (let dirname in dirs) {
      if (dirs.hasOwnProperty(dirname)) {
        this._writeFile(`${out}/${dir}/${dirname}`, 'index.js', dirs[dirname].js, 'js');
        this._writeFile(`${out}/${dir}/${dirname}`, 'index.html', dirs[dirname].html, 'html');
        this.writeMock(dirs[dirname].url, dirs[dirname].mock);
      }
    }
  }

  async writeMock(url, data) {
    if (url && data) {
      const mockRoot = rc.mockRoot || path.join((rc.webRoot || './'), 'moky_mock');
      const mockPath = path.parse(url);
      if (mockPath.dir[0] === '/') {
        mockPath.dir = mockPath.dir.slice(1);
      }
      this._writeFile(path.join(mockRoot, 'async_mock', 'get', mockPath.dir), `${mockPath.name}.json`, data, 'js');
      this._writeFile(path.join(mockRoot, 'async_mock', 'post', mockPath.dir), `${mockPath.name}.json`, data, 'js');
    }
  }

  async render() {
    if (this.meta.type === ProjectTypes.NEJ) {
      this.meta.ftl && this.writeFtl();
      this.meta.entry && this.writeEntry();
    }
    this.meta.index && this.writeIndex();
    this.meta.modules && this.writeDirs('modules');
    this.meta.modals && this.writeDirs('modals');
    this.meta.mixins && this.writeDirs('mixins');
  }

  format(content, ext) {
    let out = content;
    if (ext === 'js') {
      out = js_beautify(content, {
        indent_size: 4,
      });
      out = out.replace(/\/\* beautify ignore:start \*\//gm, '');
      out = out.replace(/\/\* beautify ignore:end \*\//gm, '');
      out = out.replace(/^\s*[\r\n]/gm, '');
      return out;
    } else if (ext === 'html') {
      out = html(content);
    }
    return content;
  }

}

module.exports = Server;
