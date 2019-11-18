const path = require('path');
const { exec, spawn } = require('child_process');

const log = require('./util/log');

class I18n {
  constructor(projectName) {
    this.projectName = projectName;
  }

  async run() {
    const { projectName } = this;
    if(!projectName) {
        log.red('Project directory must be specified.');
        process.exit(1);
    }
    let basePath = process.cwd();
    while(this.getProjectName(basePath) !== projectName) {
        basePath = path.resolve(basePath, '..'); // 向上一级，直到根目录
        process.chdir('..'); // 修改must命令行执行目录，保证能读到config文件
    }
    exec('git status', (err, stdout, stderr) => {
      const commonMenu = this.getGitStatusFilePathMenu();
      // 修改must的配置文件
      this.modifyMustConfigPath(basePath, commonMenu);
      exec('which must', (err, stdout, stderr) => {
        if(err) {
            log.red('Please install must globally `npm i -g must`');
            process.exit(1);
        }
        this.execMust(commonMenu);
      });
    });
  }

  getGitStatusFilePathMenu() {
    // 匹配modified
    const modify1 = stdout.match(/modified:(\s+\S+)/g);
    const modifyPaht = modify1.map(m => m.replace(/modified:\s+/g, ''))

    // 匹配新增
    const res = stdout.match(/\(use "git add <file>..." to include in what will be committed\)([\s\S]+)no changes added to commit/g);
    const res1 = res[0].replace(/[\n+\t]/g, '*');
    const res2 = res1.match(/\*([\s\S]+)\*/g);
    const arr = res2[0].split('*');
    const addPath = arr.filter( s => (s && s.trim()));

    // 新增和modify的url合并，只保留js和html文件
    const path = modifyPaht.filter(m => /.(html|js)/.test(m)).concat(addPath.filter(m => /.(html|js)/.test(m)));
    let commonMenu = path[0];
    path.forEach((p, idx) => {
        if(idx > 0) {
            if(commonMenu !== p) {
                commonMenu = this.getCommonMenu(commonMenu, p);
            }
        }
    });
    return commonMenu;
  }

  modifyMustConfigPath(basePath, commonMenu) {
    const configPath = path.resolve(basePath, '.must.config.js');
    // 使用公共menu替换must文件配置的sourcePath
    fs.readFile(configPath,'utf8',function(err,files){
        const res = files.replace(/sourcePath:\s"(\S+)",/g, `sourcePath: "${commonMenu}",`);
        fs.writeFile(configPath, res, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
  }
  // 获取两个url公共的目录
  getCommonMenu(menu1, menu2) {
    const menuArr1 = menu1.split('/');
    const menuArr2 = menu2.split('/');
    const res = [];
    let i = 0;
    const len = menuArr1.length > menuArr2.length ? menuArr1.length : menuArr2.length;
    while(i < len) {
        if(menuArr1[i] === menuArr2[i]) {
            res.push(menuArr1[i]);
        } else {
            break;
        }
        i++;
    }
    return res.join('/');

  }

  execMust() {
    // 只有设置stdio: 'inherit'，才能继续进行交互式访问
    const must = spawn('must', [], {
        stdio: 'inherit'
    });
    must.on('close', function(code){
        log.red('must exists with code: ' + code);
    });
  }
  
  // 获取当前执行项目跟目录
  getProjectName(basePath) {
    const basePathSplit = basePath.split('/');
    const basePathDegree = basePathSplit.length;
    return basePathSplit[basePathDegree-1];
  }
}

module.exports = I18n;
