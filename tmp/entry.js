/* eslint-disable */
NEJ.define([
  'base/klass',
  'pro/widget/module',
  './modules/page.js'
], function(k, m, Page, p, pro) {

  p._$$Module = k._$klass();
  pro = p._$$Module._$extend(m._$$MModule);

  pro.__init = function(options){
    this.__super(options);

    new Page().$inject('#app');
  };

  return p;
});