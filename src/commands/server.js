const Server = require('../core/server');
const log = require('../core/util/log');

exports.command = 'server [options]';

exports.desc = 'Fetch Server Code';

exports.builder = {
  k: {
    alias: 'key',
    demand: false,
    describe: 'Unique id mapped the project and the page configuration json object',
    type: 'string',
  },
  f: {
    alias: 'force',
    demand: false,
    describe: '强制覆盖已经存在的文件',
    type: 'boolean',
  },
};

exports.handler = async (argv) => {
  const { key, force } = argv;
  try {
    const server = new Server(key, force);
    server.run();
  } catch (error) {
    log.red(error);
  }
};
