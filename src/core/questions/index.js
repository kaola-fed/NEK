const inquirer = require('inquirer');
const Rx = require('rx');
const Questions = require('./questions.js');

let makeQuestions = function(callback){
  let prompts = new Rx.Subject();
  let options = {};
  inquirer.prompt(prompts).ui.process.subscribe(function(answer){
    if(answer.name == 'confirm'){
      prompts.onCompleted();
      if(answer.answer.toUpperCase() == 'YES'){
        callback.call(this, formatOptions(options));
      }
      return false;
    }else{
      options[answer.name] = answer.answer;
      prompts.onNext(Questions(answer));
    }
  });
  prompts.onNext(Questions({}));
};

//handlerbar模板引擎的语法较弱，无法处理一些简单的js表达式，进行一下数据转换
let formatOptions = function(options) {
  for(let [k, v] of Object.entries(options)){
    if(v == 'yes'){
      options[k] = true;
    }
    if(v == 'no'){
      options[k] = false;
    }
    if(k == 'tabCounts'){
      options.tabList = [];
      for(let index=0; index<v; ++index){
        options.tabList.push({value: 'xxx', id: index});
      }
    }
  }
  options.isList = options.type == 'list';
  options.isDetail = options.type == 'detail';
  return options;
};

module.exports = makeQuestions;