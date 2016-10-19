/* eslint-disable */
/* 下面的对象是按照json格式双引号写的, 所以需要关闭eslint */
/**
 *  页面配置json结构
 *  @param projectId {String} - 工程id
 *  @param pageName {String} -页面名称,用于生成目录名和文件名
 *  @param submodules {Array} -
 *
 *  @param structure {Array} - 页面结构,按照从上到下完整的描述一个页面上的组件以及布局信息;
 *                             其中的每个对象对应页面的一行信息;
 *  @param structure.layout {Object} - 描述一行的样式
 *  @param structure.components {Array} - 该行内部的组件描述
 *  @param structure.components.type {String} - 组件的类型
 *  @param structure.components.typeId {Number} - 组件的类型对应的id,参照map.js表
 *  @param structure.components.layout {Object} - 描述组件的布局信息
 *  @param structure.components.layout.cols {Number} - 组件占几个栅格
 *  @param structure.components.data {Object} - 每个对象中的data不同,下面是以Input为例,列出的基础的信息
 *  
 *  structure中如果遇到自定义组件,那么会按照目录结构单独给这个组件生成一个目录,存放对应的html和js; 在入口文件模板中仅引入这个组件,
 *  例如下面的add.stock, 生成的目录结构如下:
 *  |- page
 *  |---- local.test
 *  |---- |---- page.html
 *  |---- |---- page.js
 *  |---- |---- modules
 *  |---- |---- |---- add.stock
 *  |---- |---- |---- |---- index.html
 *  |---- |---- |---- |---- index.js
 *
 *  其中page.html中有如下片段:
 *  <add-stock />
 **/
export default {
  "projectId": "xxx",
  "pageName": "local.test",
  "structure": [{
    "layout":{
      "margin-bottom": 20
    },
    "components":[{
      "type": "LABEL",
      "typeId": 41,
      "layout": {
        "cols": 2
      },
      "data": {
        "text": "支出费用"
      }
    },{
      "type": "INPUT",
      "typeId": 1,
      "layout": {
        "cols": 2
      },
      "data": {
        "model": "order.fee",
        "placeholder": "费用",
        "rules": [{ "type": "isFilled", "message": "请输入费用" }]
      }
    }]
  }, {
    "layout": {
      "margin-bottom": 20
    },
    "components": [{
      "type": "Custom",
      "typeId": 0,
      "name": "add.stock",
      "structrue": [{
        "layout": {
          "margin-bottom": 20
        },
        "components": [{
          "type": "LABEL",
          "typeId": 41,
          "layout": {
            "cols": 2
          },
          "data": {
            "text": "支出费用"
          }
        }]
      }]
    }]
  }]
}