#! /usr/bin/env node

import { options, printUsage, printVersion } from './util/args';

const opts = options();

if (opts.h) {
  printUsage();
  process.exit();
}

if (opts.v) {
  printVersion();
  process.exit();
}
