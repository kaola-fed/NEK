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
    exec('which must', (err, stdout, stderr) => {
        if(err) {
            log.red('Please install must globally `npm i -g must`');
            process.exit(1);
        }
        this.execMust();
    });
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
