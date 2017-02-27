const { builder, handler } = require('moky');

exports.command = 'moky [options]';

exports.desc = 'Run mock & proxy';

exports.builder = builder;

exports.handler = handler;
