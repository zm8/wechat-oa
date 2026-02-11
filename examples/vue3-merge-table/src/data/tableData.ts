export default [
  // 个人
  {
    title: '个人',
    type: 'Individual',
  },
  {
    type: 'Individual',
    subType: 'ID',
    name: '证件号',
    _addBtn: true,
    _canAddGroup: true,
    group: '1',
  },
  {
    type: 'Individual',
    subType: 'OtherInfo',
    name: '其它信息',
    _addBtn: true,
    _canAddGroup: true,
    group: '1',
  },
  {
    type: 'Individual',
    subType: 'ID',
    name: '证件号',
    _addBtn: true,
    _delBtn: true,
    _canAddGroup: true,
    group: '2',
  },
  {
    type: 'Individual',
    subType: 'OtherInfo',
    name: '其它信息',
    _addBtn: true,
    _delBtn: true,
    _canAddGroup: true,
    group: '2',
  },
  // 金融机构
  {
    title: '金融机构',
    type: 'FinOrg',
  },
  {
    type: 'FinOrg',
    subType: 'FinRemitter',
    name: '汇款行',
    _addBtn: true,
    group: '1',
  },
  {
    type: 'FinOrg',
    subType: 'FinRemitter',
    name: '汇款行',
    _addBtn: true,
    _delBtn: true,
    group: '1',
  },
  {
    type: 'FinOrg',
    subType: 'FinRecevier',
    name: '收款行',
    group: '1',
  },
];
