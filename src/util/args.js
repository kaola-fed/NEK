import minimist from 'minimist';
import rc from 'rc';
import getUsage from 'command-line-usage';
import { version } from '../../package.json';
import usage from './usage.js';

export function options(argv) {
  const args = minimist(argv || process.argv.slice(2), {
    boolean: ['version', 'help'],
    string: ['key', 'name'],
    alias: {
      version: 'v',
      help: 'h',
      key: 'k',
      name: 'n'
    },
    unknown() {
      console.log('unknow arguments, try nek -h to see full usage');
    }
  });
  return rc('nek', { name: 'test' }, args);
}

export function printVersion() {
  /* eslint-disable no-console */
  console.log(version);
}

export function printUsage() {
  /* eslint-disable no-console */
  console.log(getUsage(usage));
}

export default {
  options,
  printVersion,
  printUsage
};

