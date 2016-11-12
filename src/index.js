#! /usr/bin/env node
/* eslint no-unused-expressions: 0 */

import yargs from 'yargs';
import consoleStamp from 'console-stamp';

consoleStamp(console, 'HH:MM:ss');

yargs
  .commandDir('commands')
  .demand(1)
  .help()
  .version()
  .argv;
