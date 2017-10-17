const inquirer = require('inquirer');
const Rx = require('rx');
const makeQuestion = require('./questions.js');

// 进行一下数据转换
const formatOptions = options => options;

const makeQuestions = (name, callback) => {
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
  prompts.onNext(makeQuestion({ name }));
};

module.exports = makeQuestions;
