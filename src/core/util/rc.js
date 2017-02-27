const rc = require('rc');

const config = rc('nek', {
  projectId: '582ec571bfc09908e38b79dd',
  urlReplace: '',
  pageRoot: './src/main/webapp/backend/template',
  pageRootName: '',
  jsRoot: './src/main/webapp/backend/src/javascript/page/',
  BaseComponent: 'pro/widget/BaseComponent',
  ListComponent: 'pro/components/ListComponent',
  BaseModal: 'pro/components/modal/modal',
  // urlMaps: './moky.urlMaps.js',
  api: 'http://nek.kaolafed.com/api',
});

module.exports = config;
