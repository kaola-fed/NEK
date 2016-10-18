import request from 'request-promise';

exports.command = 'build [options]';

exports.desc = 'Build a new page';

exports.builder = {
  k: {
    alias: 'key',
    demand: true,
    describe: 'Unique id mapped the page configuration json object',
    type: 'string',
  },
  n: {
    alias: 'name',
    demand: true,
    default: 'local.test',
    describe: 'Folder names or file names to create.',
    type: 'string',
  },
};

exports.handler = async (argv) => {
  const { key, name } = argv;
  const json = await request('https://jsonplaceholder.typicode.com/posts/1');
  console.log(json, name);
};
