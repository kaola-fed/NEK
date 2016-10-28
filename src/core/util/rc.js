import rc from 'rc';

const config = rc('nek', {
  webRoot: './src/main/webapp/backend',
  viewRoot: './src/main/webapp/backend/template',
  jsRoot: './src/main/webapp/backend/src/javascript/page/',
  BaseComponent: 'pro/widget/BaseComponent',
  ListComponent: 'pro/components/ListComponent',
  BaseModal: 'pro/components/modal/modal',
});

export default config;
