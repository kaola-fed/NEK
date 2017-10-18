const Scaffold = require('../core/scaffold');
const log = require('../core/util/log');

exports.command = 'scaffold [options]';

exports.desc = 'Scaffold for Creating Project';

exports.builder = {
  i: {
    alias: 'init',
    demand: false,
    describe: '选择要创建的工程类型并创建',
    type: 'string',
  },
  a: {
    alias: 'add',
    demand: false,
    describe: '添加映射',
    type: 'string',
  },
  d: {
    alias: 'del',
    demand: false,
    describe: '删除映射',
    type: 'string',
  },
  l: {
    alias: 'list',
    demand: false,
    describe: '映射列表',
    type: 'boolean',
  },
};

exports.handler = async (argv) => {
  try {
    const scaffold = new Scaffold(argv);
    scaffold.run();
  } catch (error) {
    log.red(error);
  }
};
