export default (Handlebars) => {
  Handlebars.registerHelper('model', context => `{${context}}`);
  Handlebars.registerHelper('rules', context => `{rules.${context}`);
  Handlebars.registerHelper('json', context => JSON.stringify(context));

  Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
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

  Handlebars.registerHelper('isBinding', (key, options) => {
    const array = ['value', 'source'];
    if (array.indexOf(key) != -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
