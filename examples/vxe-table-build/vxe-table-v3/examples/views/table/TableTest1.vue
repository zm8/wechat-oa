<template>
  <div>
    <vxe-switch v-model="resizableConfig.dragMode" open-value="fixed" close-value="auto"></vxe-switch>
    <div style="height: 400px;overflow: hidden;">
      <vxe-table
        border
        stripe
        resizable
        highlight-hover-row
        height="100%"
        :padding="false"
        :loading="demo1.loading"
        :resizable-config="resizableConfig"
        :checkbox-config="{labelField: 'id', highlight: true, range: true}"
        :data="demo1.tableData">
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column type="checkbox" title="ID" width="140"></vxe-column>
        <vxe-column field="role" title="Role"></vxe-column>
        <vxe-column field="name" title="Name" sortable></vxe-column>
        <vxe-column field="age" title="Age" :filters="ageOptions" :filter-method="filterAgeMethod">
          <template #filter="{ $panel, column }">
            <vxe-input class="my-input" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)" placeholder="按回车确认筛选" />
          </template>
        </vxe-column>
        <vxe-column field="sex" title="Sex" :filters="demo1.sexList" :filter-multiple="false" :formatter="formatterSex"></vxe-column>
        <vxe-column field="address" title="Address" show-overflow></vxe-column>

        <template #loading>
          <div>加载中。。。。。。</div>
        </template>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeColumnPropTypes, VxeTablePropTypes } from '../../../types'

export default Vue.extend({
  data () {
    const demo1 = {
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

    const resizableConfig: VxeTablePropTypes.ResizableConfig = {
      dragMode: 'fixed'
    }

    const ageOptions: VxeColumnPropTypes.Filters = [
      { data: '' }
    ]

    const formatterSex: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
      const item = demo1.sexList.find(item => item.value === cellValue)
      return item ? item.label : ''
    }

    const filterAgeMethod: VxeColumnPropTypes.FilterMethod = ({ option, row }) => {
      return row.age >= option.data
    }

    return {
      demo1,
      resizableConfig,
      ageOptions,
      formatterSex,
      filterAgeMethod
    }
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
    }, 500)
  }
})
</script>
