<template>
  <el-table :data="tableData" style="width: 100%" border>
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column label="boss" width="100" sortable>
      <template slot-scope="{ row }">
        <span>{{ row | formatBoss }}</span>
      </template>
    </el-table-column>
    <el-table-column label="周目" width="100" sortable>
      <template slot-scope="{ row }">
        <span>{{ row | formatWeek }}</span>
      </template>
    </el-table-column>
    <el-table-column label="阶段" sortable min-width="200">
      <template slot-scope="{ row }">
        <span>{{ row | formatStage }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="阵容"
      sortable
      :show-overflow-tooltip="true"
      min-width="200"
    >
      <template slot-scope="{ row }">
        <el-tooltip placement="right">
          <span slot="content" class="line-up">{{ row | formatLineUp }}</span>
          <span class="line-up">{{ row | formatLineUpSimple }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="伤害" sortable width="100">
      <template slot-scope="{ row }">
        <span>{{ row | formatNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="300">
      <template slot-scope="{ row }">
        <router-link :to="`/view-work/${row.id}`" class="link">
          <el-button type="text">查看</el-button>
        </router-link>
        <el-button type="text" @click="editWork(row)">编辑</el-button>
        <el-button type="text" @click="deleteWork(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deleteWork } from '../../../api';
import { formatNumber } from '../../../utils';
import CHARA_NAME from '../../../CHARA_NAME';
import filters from '../filters';

export default {
  name: 'WorkTable',
  filters,
  computed: {
    tableData() {
      return this.$store.state.workList;
    },
  },
  mounted() {
    this.fetchWorkList();
  },
  methods: {
    /**
     * 获取作业列表
     */
    fetchWorkList() {
      this.$store.dispatch('GET_WORK_LIST');
    },
    /**
     * 删除作业
     */
    deleteWork(row) {
      this.$confirm('此操作将删除作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const params = {
            id: row.id,
          };
          const res = await deleteWork(params);
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.$emit('update');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    /**
     * 编辑作业
     */
    editWork(row) {
      this.$emit('edit-work', row.id);
    },
  },
};
</script>

<style scoped>
.line-up {
  white-space: pre-line;
}
.link {
  margin-right: 10px;
}
</style>
