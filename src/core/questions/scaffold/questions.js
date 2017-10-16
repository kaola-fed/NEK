const questions = [{
  name: 'type',
  type: 'list',
  message: '> 工程类型?',
  choices: [
    { name: 'nej + regular + nek-ui', value: 'nrn' },
    { name: 'webpack + vue + element-ui(SPA)', value: 'wve' }
  ],
  default: 'nrn',
}, {
  name: 'keyword',
  type: 'string',
  message: '> 关键字:'
}, {
  name: 'url',
  type: 'string',
  message: '> 仓库地址:'
}, {
  name: 'confirm',
  type: 'list',
  message: '> 确认操作?',
  default: 'yes',
  choices: ['yes', 'no'],
}];

const nextQuestion = (name) => {
  const result = questions.find((item) => {
    if (item.name === name) {
      return item;
    }
    return false;
  });
  return result;
};

const makeQuestion = (answer) => {
  switch (answer.name) {
    case undefined:
    case null:
    case 'init':
      return nextQuestion('type');
    case 'add':
      return nextQuestion('keyword');
    case 'keyword':
      return nextQuestion('url');
    default:
      return nextQuestion('confirm');
  }
};

module.exports = makeQuestion;
