const request = require('request-promise');
// const question = require('./questions/scaffold/index');

const rc = require('./util/rc');
const log = require('./util/log');
const ora = require('ora');
const download = require('download');
const validUrl = require('valid-url');

class Scaffold {
  constructor(options) {
    this.options = options;
  }

  async run() {
    const { init, add, del, list } = this.options;
    if (list) {
      this.list();
    } else if (add !== undefined) {
      const [keyword, url] = this.getNextParam(['-a', '-add'], 2);
      if (!keyword || !url) {
        log.red('use nek scaffold -a [keyword] [url] to add a map.');
        process.exit(1);
      }
      if (!validUrl.isUri(url)) {
        log.red('url invalid.');
        process.exit(1);
      }
      this.add(keyword, url);
    } else if (del !== undefined) {
      const keyword = del;
      if (!keyword) {
        log.red('use nek scaffold -d [keyword] to delete an existed map,\nor use `nek scaffold -l to check all map`.');
        process.exit(1);
      }
      this.remove(keyword);
    } else if (init !== undefined) {
      const keyword = init;
      this.getTpl(keyword);
      // question('init', (options) => {
    }
  }

  getNextParam(param, length) {
    let location = -1;
    const argv = [...process.argv];
    if (typeof param === 'string') {
      location = argv.indexOf(param);
    } else if (Array.isArray(param)) {
      argv.find((value, index) => {
        if (param.indexOf(value) !== -1) {
          location = index;
          return true;
        }
        return false;
      });
    }
    if (location !== -1) {
      argv.splice(0, location + 1);
      argv.length = length;
      return argv;
    }
  }

  async add(keyword, url) {
    const exist = await request(`${rc.api}/scaffold/exist?keyword=${keyword}`, { json: true });
    if (exist) {
      log.red(`keyword[${keyword}] exist, please use another.`);
      process.exit(1);
    }
    const result = await request(`${rc.api}/scaffold/add?keyword=${keyword}&url=${url}`, { json: true });
    if (result.ok) {
      log.green(`keyword[${keyword}] mapped to url[${url}].`);
    }
  }

  async remove(keyword) {
    const exist = await request(`${rc.api}/scaffold/exist?keyword=${keyword}`, { json: true });
    if (!exist) {
      log.red('keyword do not exist, use `nek scaffold -l to check all map list`.');
      process.exit(1);
    }
    const result = await request(`${rc.api}/scaffold/remove?keyword=${keyword}`, { json: true });
    if (result.ok) {
      log.green(`keyword[${keyword}] removed.`);
    }
  }

  async list() {
    const map = await request(`${rc.api}/scaffold/map`, { json: true });
    map.forEach((value) => {
      log.green(`${value.keyword} => ${value.url}`);
    });
  }

  async getTpl(keyword) {
    const result = await request(`${rc.api}/scaffold/getUrl?keyword=${keyword}`, { json: true });
    const spinner = ora('获取工程模板...').start();
    await download(result.url, 'dist', {
      extract: true,
      strip: 1,
    });
    spinner.succeed('download success.');
  }
}

module.exports = Scaffold;
