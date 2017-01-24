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
  n: {
    alias: 'new',
    demand: false,
    default: false,
    describe: 'Auto create mock file if not exists',
  },
  r: {
    alias: 'write',
    demand: false,
    default: 0,
    describe: 'Write proxy data to mock file (1-write if not exist, 2-write even if exist)',
  },
  V: {
    alias: 'verbose',
    demand: false,
    default: false,
    describe: 'Show detail log',
  },
};

exports.handler = async (argv) => {
  const { env, verbose, write, new: autoGenMock } = argv;
  const options = parseConfig(path.resolve(argv.c));
  Object.assign(options, { env, verbose, write, autoGenMock });

  moky(options);
};
