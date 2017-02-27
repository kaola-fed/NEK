#! /usr/bin/env node
/* eslint no-unused-expressions: 0 */

const yargs = require('yargs');

yargs
  .commandDir('commands')
  .demand(1)
  .help()
  .version()
  .argv;
