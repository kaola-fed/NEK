import path from 'path';
import { moky, parseConfig } from 'moky';

exports.command = 'moky [options]';

exports.desc = 'Run mock & proxy';

exports.builder = {
  e: {
    alias: 'env',
    demand: false,
    default: 'mock',
    describe: 'Unique id mapped the project and the page configuration json object',
  },
  c: {
    alias: 'config',
    demand: false,
    default: 'moky.config.js',
    describe: 'Debug env, see <proxyMaps> in configure file',
  },
};

exports.handler = async (argv) => {
  const { env, config } = argv;
  const options = parseConfig(path.resolve(config));
  options.env = env;
  moky(options);
};
