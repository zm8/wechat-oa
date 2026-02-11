<script setup lang="ts">
import computeMergedRows, { type MergedRules } from '@/utils/computeMergedRows';
import tableData from '../data/tableData';
import type { TableInstance } from 'element-plus';

type TableItem = (typeof tableData)[number];

const mergeRules: MergedRules<TableItem> = [
  {
    col: 0,
    keys: ['type', 'group'],
    getSpan: (row: TableItem) => {
      if (row.title) {
        return [1, 4];
      }
    },
  },
  {
    col: 1,
    keys: ['type', 'subType'],
    getSpan: (row: TableItem) => {
      if (row.title) {
        return [0, 0];
      }
    },
  },
  {
    col: 2,
    keys: ['type', 'subType'],
    getSpan: (row: TableItem) => {
      if (row.title) {
        return [0, 0];
      }
    },
  },
  {
    col: 3,
    keys: ['type', 'subType'],
    getSpan: (row: TableItem) => {
      if (row.title) {
        return [0, 0];
      }
    },
  },
];

const rowSpanObj = computeMergedRows(tableData, mergeRules);

const arraySpanMethod: TableInstance['spanMethod'] = ({ rowIndex, columnIndex }) => {
  return rowSpanObj[columnIndex]?.[rowIndex] ?? [1, 1];
};
</script>

<template>
  <el-table :data="tableData" :span-method="arraySpanMethod" border>
    <el-table-column prop="group" label="组" />
    <el-table-column prop="name" label="选项" />
    <el-table-column prop="content" label="内容">
      <el-input />
    </el-table-column>
    <el-table-column prop="operation" label="操作">
      <template #default="scope">
        <el-button v-if="scope.row._addBtn" size="small" type="primary">新增</el-button>
        <el-button v-if="scope.row._delBtn" size="small" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
