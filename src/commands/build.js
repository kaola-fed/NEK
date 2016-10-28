import Builder from '../core/builder';

exports.command = 'build [options]';

exports.desc = 'Build a new page';

exports.builder = {
  k: {
    alias: 'key',
    demand: true,
    describe: 'Unique id mapped the project and the page configuration json object',
    type: 'string',
  },
  n: {
    alias: 'name',
    demand: false,
    default: 'local.test',
    describe: 'Folder names or file names to create.',
    type: 'string',
  },
};

exports.handler = async (argv) => {
  const { key } = argv;
  try {
    const builder = new Builder(key);
    builder.run();
  } catch (error) {
    console.error(error);
  }
};
