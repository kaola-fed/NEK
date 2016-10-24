/* eslint-disable */

define(['{{BaseComponent}}'
  {{#each modals}}
    ,'../modal/{{name}}/index.js'
  {{/each}}
  {{#each modules}}
    ,'./{{name}}/index.js'
  {{/each}}
], function(BaseComponent
  {{#each modals}}
    ,{{cammel name}}
  {{/each}}
) {
  var Component = BaseComponent.extend({
    {{#if name}}
    name:'{{name}}',
    {{/if}}
    config:function(data) {
      this.supr(data);
    }
  });

  return Component;;
});