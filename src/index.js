#! /usr/bin/env node
/* eslint no-unused-expressions: 0 */

import yargs from 'yargs';

yargs
  .commandDir('commands')
  .demand(1)
  .help()
  .version()
  .argv;
