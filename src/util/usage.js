import { description } from '../../package.json';

export default [
    {
      header: 'Description',
      content: description,
    },
    {
      header: 'Usage',
      content: [
        '$ nek [bold]{--key} [underline]{jsonId} [bold]{--name} [underline]{pageName}',
        '$ nek [bold]{--help}',
        '$ nek [bold]{--version}'
      ],
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'help',
          alias: 'h',
        },
        {
          name: 'version',
          alias: 'v',
        },
        {
          name: 'key',
          alias: 'k',
          typeLabel: '[underline]{jsonId}',
          description: 'Unique id mapped the page configuration json object',
        },
        {
          name: 'name',
          alias: 'n',
          typeLabel: '[underline]{pageName}',
          description: 'Folder names or file name to create.',
        },
      ],
    },
  ];