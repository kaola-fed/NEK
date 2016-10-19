/**
 * ids映射表,分两部分:
 * 0. 自定义虚拟组件取值0
 * 1. 基础组件 取值1-1000
 *    1.1 表单类1-100
 *    1.2 导航类101-200
 *    1.3 窗口类201-300
 *    1.4 数据类301-400
 *    1.5 其他类401-500
 * 2. 业务组件 取值1001-2000
 */
export default {
  /* ____基础组件1-1000____ */
  /* 1.1 表单类组件1-100 */
  /* Input 1-10 */
  Input: 1,
  NumberInput: 2,
  TextArea: 3,

  /* Select 11-20 */
  Select: 11,
  SelectGroup: 12,
  Suggest: 13,
  TreeSelect: 14,

  /* Check 21-30 */
  CheckBox: 21,
  CheckGroup: 22,
  RadioGroup: 23,

  /* Date 31-40 */
  DatePicker: 31,
  TimePicker: 32,
  DateTimePicker: 33,
  Calendar: 34,

  /* FormCommon 41-50 */
  Label: 41,

  /* 1.2 导航类基础组件101-200 */
  DropDown: 101,
  Menu: 102,
  Tabs: 103,
  Collaspse: 104,
  Pager: 105,

  /* 1.3 窗口类201-300 */
  Notify: 201,
  Modal: 202,

  /* 1.4 数据类301-400 */
  ListView: 301,
  TreeView: 302,
  MultiTreeView: 303,

  /* 1.5 其他类401-500 */
  Progress: 401,
  Loading: 402,
  Validation: 403,
  Draggable: 404,
  Droppable: 405,

  /* ____业务组件2001-3000____ */
  /* 商品选择 */
  GoodsModal: 2001,
  /* 地区选择 */
  DistrictModal: 2002,
  /* 供应商信息 */
  SupplierInfo: 2003,
};

