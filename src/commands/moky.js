import { builder, handler } from 'moky';

exports.command = 'moky [options]';

exports.desc = 'Run mock & proxy';

exports.builder = builder;

exports.handler = handler;
