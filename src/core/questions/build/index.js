const inquirer = require('inquirer');
const Rx = require('rx');
const makeQuestion = require('./questions.js');

// handlerbar模板引擎的语法较弱，无法处理一些简单的js表达式，进行一下数据转换
const formatOptions = (options) => {
  for (const [k, v] of Object.entries(options)) {
    if (v === 'yes') {
      options[k] = true;
    }
    if (v === 'no') {
      options[k] = false;
    }
    if (k === 'tabCounts') {
      options.tabList = [];
      for (let index = 0; index < v; index += 1) {
        options.tabList.push({ value: 'xxx', id: index });
      }
    }
  }
  options.isList = options.type === 'list';
  options.isDetail = options.type === 'detail';
  return options;
};

const makeQuestions = (callback) => {
  const prompts = new Rx.Subject();
  const options = {};
  inquirer.prompt(prompts).ui.process.subscribe((answer) => {
    if (answer.name === 'confirm') {
      prompts.onCompleted();
      if (answer.answer.toUpperCase() === 'YES') {
        callback.call(this, formatOptions(options));
      }
      return false;
    }
    options[answer.name] = answer.answer;
    prompts.onNext(makeQuestion(answer));
  });
  prompts.onNext(makeQuestion({}));
};

module.exports = makeQuestions;
