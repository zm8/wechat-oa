<template>
  <div>
    <vxe-toolbar ref="toolbarRef" print export import custom></vxe-toolbar>

    <vxe-table
      border
      stripe
      resizable
      highlight-hover-row
      height="400"
      ref="tableRef"
      id="aaaa"
      :row-config="{useKey: true}"
      :column-config="{useKey: true}"
      :print-config="{}"
      :import-config="{}"
      :export-config="{}"
      :custom-config="{mode: 'drawer', storage: true}"
      :loading="demo1.loading"
      :expand-config="{iconOpen: 'vxe-icon-question-circle-fill', iconClose: 'vxe-icon-question-circle-fill'}"
      :checkbox-config="{labelField: 'id', highlight: true, range: true}"
      :data="demo1.tableData">
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column type="checkbox" title="ID" width="140"></vxe-column>
      <vxe-colgroup title="分组1" field="g1">
        <vxe-column type="expand" field="role" title="Role">
          <template #content="{ row }">
            <div>{{ row.name }}</div>
          </template>
        </vxe-column>
        <vxe-column field="name" title="Name" sortable></vxe-column>
      </vxe-colgroup>
      <vxe-column field="sex11" title="<span style='color:red;'>Sex222</span>" type="html"></vxe-column>
      <vxe-column field="sex22" title="<span style='color:red;'>Sex1111</span>" type="html" :visible="false"></vxe-column>
      <vxe-column field="sex" title="Sex" :filters="demo1.sexList" :filter-multiple="false" :formatter="formatterSex"></vxe-column>
      <vxe-column
        field="age"
        title="Age"
        sortable
        :filters="demo1.ageOptions"
        :filter-method="filterAgeMethod"></vxe-column>
      <vxe-column field="address" title="Address" show-overflow></vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeTableInstance, VxeToolbarInstance } from '../../../types'

export default Vue.extend({
  data () {
    return {
      demo1: {
        loading: false,
        tableData: [] as any[],
        sexList: [
          { label: '女', value: '0' },
          { label: '男', value: '1' }
        ],
        ageOptions: [
          { label: '大于16岁', value: 16 },
          { label: '大于26岁', value: 26 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 },
          { label: '大于30岁', value: 30 }
        ]
      }
    }
  },
  methods: {
    formatterSex  ({ cellValue }: any) {
      const item = this.demo1.sexList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    filterAgeMethod ({ value, row }: any) {
      return row.age >= value
    }
  },
  created () {
    this.$nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = this.$refs.tableRef as VxeTableInstance
      const $toolbar = this.$refs.toolbarRef as VxeToolbarInstance
      if ($table && $toolbar) {
        $table.connect($toolbar)
      }
    })
  },
  mounted () {
    this.demo1.loading = true
    setTimeout(() => {
      this.demo1.tableData = [
        { id: 10001, name: 'Test1', role: 'Develop', sex: '0', age: 28, address: 'test abc' },
        { id: 10002, name: 'Test2', role: 'Test', sex: '1', age: 22, address: 'Guangzhou' },
        { id: 10003, name: 'Test3', role: 'PM', sex: '0', age: 32, address: 'Shanghai' },
        { id: 10004, name: 'Test4', role: 'Designer', sex: '1', age: 23, address: 'test abc' },
        { id: 10005, name: 'Test5', role: 'Develop', sex: '1', age: 30, address: 'Shanghai' },
        { id: 10006, name: 'Test6', role: 'Designer', sex: '1', age: 21, address: 'test abc' },
        { id: 10007, name: 'Test7', role: 'Test', sex: '0', age: 29, address: 'test abc' },
        { id: 10008, name: 'Test8', role: 'Develop', sex: '0', age: 35, address: 'test abc' },
        { id: 10009, name: 'Test9', role: 'Test', sex: '1', age: 21, address: 'test abc' },
        { id: 10010, name: 'Test10', role: 'Develop', sex: '0', age: 28, address: 'test abc' },
        { id: 10011, name: 'Test11', role: 'Test', sex: '0', age: 29, address: 'test abc' },
        { id: 10012, name: 'Test12', role: 'Develop', sex: '1', age: 27, address: 'test abc' },
        { id: 10013, name: 'Test13', role: 'Test', sex: '0', age: 24, address: 'test abc' },
        { id: 10014, name: 'Test14', role: 'Develop', sex: '1', age: 34, address: 'test abc' },
        { id: 10015, name: 'Test15', role: 'Test', sex: '1', age: 21, address: 'test abc' },
        { id: 10016, name: 'Test16', role: 'Develop', sex: '0', age: 20, address: 'test abc' },
        { id: 10017, name: 'Test17', role: 'Test', sex: '1', age: 31, address: 'test abc' },
        { id: 10018, name: 'Test18', role: 'Develop', sex: '0', age: 32, address: 'test abc' },
        { id: 10019, name: 'Test19', role: 'Test', sex: '1', age: 37, address: 'test abc' },
        { id: 10020, name: 'Test20', role: 'Develop', sex: '1', age: 41, address: 'test abc' }
      ]
      this.demo1.loading = false
    }, 100)
  }
})
</script>
