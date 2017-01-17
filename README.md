# NEK

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Downloads][downloads-image]][npm-url] [![Code style][style-image]][style-url]

Nice easy Kaola project toolkit

## 基本介绍
NEK 是考拉前端提高开发效率开发的一个脚手架工具链，主要是为了统一后台前端规范、减少写重复代码、以及方便离线调试。总共包括三个部分：nek-cli（即本工程），[nek-ui](https://github.com/kaola-fed/nek-ui)，[nek-server](https://github.com/kaola-fed/nek-server)。其中三者的关系可以简单用下图表示：

![](https://cdn.int64ago.org/dttms37fojiv7jtixdpldi.PNG)

## 如何使用
#### 配置
NEK 的配置需要在项目的前端根目录创建一个名为 `.nekrc` 的文件，配置以下字段：
```
{
    "projectId": "项目 ID，从 NEK-Server 可得到",
    "urlReplace": "目前目录是基于 URL 结构生成的，这个选项表示去除冗余的 URL 前缀",
    "pageRoot": "静态文件目录",
    "jsRoot": "JS 根目录",
    "urlMaps": "moky urlMaps 路径，可选",
    "BaseComponent": "基础组件路径（NEJ 路径，下同）",
    "ListComponent": "列表组件路径",
    "BaseModal": "基础模态框路径"
}

```

NEK 的 mock 和 proxy 功能是单独由 [moky][moky] 提供的，所以需要在 `.nekrc` 同级目录下新建一个 `moky.config.js` 文件，具体配置见 moky 文档。

#### 根据 URL 生成指定目录结构

如果你希望从 URL 快速生成目录结构和基础模板，可以执行 `nek build -u <url>` 命令，但是这里的模板并不是无中生有的，前提是该项目在 [NEK-Server](http://nek.kaolafed.com) 配置好了模板。

#### 从拖拽好的页面生成目录结构和基础页面代码

如果你已经在 NEK-Server 上通过拖拽生成好了页面，那么复制页面 `pageId` 后就可以通过命令 `nek build -k <pageId>` 直接生成目录结构和填充好基础页面的代码了。

#### 本地调试

本地调试几乎跟 [moky][moky] 一样，唯一的区别就是你可以直接用 `nek moky` 替代 `moky` 命令。

#### 模板样例

 > 因项目而异

 - html
 
```
 {{#if title}}
<h2 class="u-title">{{title}}</h2>
{{/if}}

{{#ifAllCustoms rows false}}
<ui.form>
{{/ifAllCustoms}}
{{#each rows}}
    {{#ifCond components.length '>' 1}}
    <div class="g-row">
    {{/ifCond}}
    {{#each components}}
    {{#ifCond id '===' 0}}
    {{!-- 自定义模块备注 --}}
        {{#if desc}}<!-- {{desc}} -->{{/if}}
        <{{name}} 
            {{#if cols}}{{#ifCond cols '<' 12}}cols={{cols}}{{/ifCond}}{{/if}}
            {{#if offset}}offset={{offset}}{{/if}}
        />
    {{else}}
        {{!-- 组件开始 --}}
        <form.item 
            {{#if labelTitle}}title="{{labelTitle}}"{{/if}}
            {{#if labelHint}}tip="{{labelHint}}"{{/if}}
            {{#if cols}}{{#ifCond cols '<' 12}}cols={{cols}}{{/ifCond}}{{/if}}
            {{#if offset}}offset={{offset}}{{/if}}
            {{#if required}}required{{/if}}
        >
        <{{name}}
            {{!-- 遍历组件属性，3种情况：1. none 2. expression 3. 普通字符串属性 --}}
            {{#each conf}}
                {{#ifCond type '==' 'none'}}
                {{key}}
                {{else}}
                    {{#ifCond type '==' 'expression'}}
                    {{key}}={{model value}}
                    {{else}}
                    {{key}}="{{value}}"
                    {{/ifCond}}
                {{/ifCond}}
            {{/each}}
            />
    </form.item>
    {{/ifCond}}
    {{/each}}
    {{#ifCond components.length '>' 1}}
    </div>
    {{/ifCond}}
{{/each}}
{{#ifAllCustoms rows false}}
</ui.form>
{{/ifAllCustoms}}
```
 
 - javascript
 
```
 {{#macro "deps"}}
/* beautify ignore:start */
  {{#if isModal}}
  '{{BaseModal}}'
  {{else}}
  '{{BaseComponent}}'
  {{/if}}
  {{#if isPage}}
  ,'text!./page.html'
  {{else}}
  ,'text!./index.html'
  {{/if}}
  {{#each modules}}
  ,'./modules/{{name}}/index.js'
  {{/each}}
/* beautify ignore:end */
{{/macro}}

/**
 * @file 描述本文件的主体功能
 *
 * @param {component} ProductModal - 描述依赖组件的作用
 * @param {plugin}    pricePlugin  - 描述plugin的作用
 *
 * @see KJDS-2758: {{today}} 你的名字 初始化页面
 */
define([{{deps}}
], function({{#if isModal}}BaseModal{{else}}BaseComponent{{/if}},template) {

  {{#if isModal}}
  return BaseModal.extend({
    {{#if name}}
    name: '{{name}}',
    {{/if}}
    template: template,
    config: function(data) {
      this.supr(data);
    }
  })
  {{else}}
  return BaseComponent.extend({
    {{#if name}}
    name: '{{name}}',
    {{/if}}
    template: template,
    config: function(data) {
      this.supr(data);
    }
  });
  {{/if}}
});
```
 
 - entry
 
```
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
```
 
 - freemarker
 
```
 <!DOCTYPE html>
<html>
<head>
    <#include "/common/import.ftl">
    <title>页面title</title>
    <meta charset="utf-8"/>
    <@css/>
</head>
<body>
<@topHeader />
<div class="g-body">
    <@leftMenu />
    <div class="g-main">
        <div id="app"></div>
    </div>
</div>
<@htmFoot />
<script src="${nejRoot}"></script>
<script>
    NEJ.define([
        'pro/page/{{pageName}}/entry'
    ],function(m){
        m._$$Module._$allocate();
    });
</script>
</body>
</html>
```

### License
[![license][license-image]][license-url]

[downloads-image]: https://img.shields.io/npm/dm/nek.svg

[npm-url]: https://npmjs.org/package/nek
[npm-image]: https://img.shields.io/npm/v/nek.svg

[travis-url]: https://travis-ci.org/kaola-fed/NEK
[travis-image]: https://img.shields.io/travis/kaola-fed/NEK.svg

[license-url]: https://github.com/kaola-fed/NEK/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/kaola-fed/NEK.svg

[style-url]: https://github.com/airbnb/javascript
[style-image]: https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg

[moky]: https://github.com/int64ago/moky