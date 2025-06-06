<template>
  <div>
    <vxe-table
      border
      show-overflow
      height="300"
      :column-config="{ resizable: true }"
      :virtual-y-config="{ enabled: true, gt: 0 }"
      :data="tableData"
    >
      <vxe-column type="seq" width="70"></vxe-column>
      <vxe-column field="name" title="Name"></vxe-column>
      <vxe-column field="role" title="Role"></vxe-column>
      <vxe-column field="sex" title="Sex"></vxe-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  data() {
    const tableData = [];
    return {
      tableData,
    };
  },
  methods: {
    // 模拟行数据
    loadList(size = 300) {
      const dataList = [];
      for (let i = 0; i < size; i++) {
        dataList.push({
          id: 10000 + i,
          name: "Test" + i,
          role: "Developer",
          sex:
            i === 0
              ? "男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男男"
              : "男",
        });
      }
      this.tableData = dataList;
    },
  },
  created() {
    this.loadList();
  },
};
</script>

<style>
body .vxe-table .vxe-body--column.col--ellipsis:not(.col--actived) > .vxe-cell {
  white-space: normal;
  max-height: fit-content;
}
</style>
