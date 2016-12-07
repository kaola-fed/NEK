/* eslint prefer-arrow-callback:0 */
/* eslint func-names:0 */
/* 由于箭头函数中的this是外部的this, 所以这里没法使用箭头函数; */
import uppercamelcase from 'uppercamelcase';

export default (Handlebars) => {
  Handlebars.registerHelper('model', function (context) { return `{${context}}`; });
  Handlebars.registerHelper('rules', function (context) { return `{rules.${context}}`; });

  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  Handlebars.registerHelper('cammel', function (context) {
    const name = uppercamelcase(context);
    return `${name}Modal`;
  });

  Handlebars.registerHelper('ifAllCustoms', function (rows, condition, options) {
    let flag = false;
    rows.forEach(function (row) {
      const { components } = row;
      if (components.length && components[0].id == 0) {
        flag = true;
      }
    });
    return flag == condition ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        /* eslint eqeqeq:0 */
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  Handlebars.registerHelper('macro', function (name, defaults) {
    Handlebars.registerHelper(name, function (options) {
      const e = { ...this, ...defaults.hash, ...options.hash };
      return new Handlebars.SafeString(defaults.fn(e));
    });
  });
};
