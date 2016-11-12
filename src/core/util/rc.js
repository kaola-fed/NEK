import rc from 'rc';

const config = rc('nek', {
  projectId: 'haitao',
  urlReplace: '',
  pageRoot: './src/main/webapp/backend/template',
  pageRootName: '',
  jsRoot: './src/main/webapp/backend/src/javascript/page/',
  BaseComponent: 'pro/widget/BaseComponent',
  ListComponent: 'pro/components/ListComponent',
  BaseModal: 'pro/components/modal/modal',
});

export default config;
