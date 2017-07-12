#! /usr/bin/env node
/* eslint no-unused-expressions: 0 */

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('../package');

updateNotifier({ pkg }).notify();

yargs
  .commandDir('commands')
  .demand(1)
  .help()
  .version()
  .argv;
