const questions = [{
  name: 'type',
  type: 'list',
  message: '> 页面类型？',
  choices: [
    { name: '列表页', value: 'list' },
    { name: '详情页', value: 'detail' },
    { name: '默认', value: 'default' },
  ],
  default: 'list',
}, {
  name: 'header',
  type: 'list',
  message: '> 是否需要fix头部？',
  default: 'yes',
  choices: ['yes', 'no'],
}, {
  name: 'footer',
  type: 'list',
  message: '> 是否需要fix底部操作栏？',
  default: 'yes',
  choices: ['yes', 'no'],
}, {
  name: 'tabs',
  type: 'list',
  message: '> 是否生成tabs？',
  default: 'yes',
  choices: ['yes', 'no'],
}, {
  name: 'tabCounts',
  type: 'input',
  message: '> tab数量?',
  filter: (value) => {
    value = parseInt(value, 10);
    if (!value) {
      value = 3; // default
    }
    return value;
  },
  default: 3,
}, {
  name: 'search',
  type: 'list',
  message: '> 是否提供搜索区？',
  default: 'yes',
  choices: ['yes', 'no'],
}, {
  name: 'list',
  type: 'list',
  message: '> 是否生成列表？',
  defalut: 'yes',
  choices: ['yes', 'no'],
}, {
  name: 'confirm',
  type: 'list',
  message: '> 确认生成?',
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
      return nextQuestion('type');
    case 'type':
      if (answer.answer === 'list') {
        return nextQuestion('tabs');
      } else if (answer.answer === 'detail') {
        return nextQuestion('header');
      }
      return nextQuestion('confirm');
    case 'header':
      return nextQuestion('footer');
    case 'tabs':
      if (answer.answer.toUpperCase() === 'YES') {
        return nextQuestion('tabCounts');
      }
      return nextQuestion('search');
    case 'tabCounts':
      return nextQuestion('search');
    case 'search':
      return nextQuestion('list');
    default:
      return nextQuestion('confirm');
  }
};

module.exports = makeQuestion;
