<template>
  <div class="work-table-container">
    <div class="row">
      <div class="cell" style="width: 100px;">
        <span class="label">boss</span>
      </div>
      <div class="cell" style="width: 100px;">
        <span class="label">周目</span>
      </div>
      <div class="cell" style="width: 200px;">
        <span class="label">阶段</span>
      </div>
      <div class="cell" style="width: 200px;">
        <span class="label">阵容</span>
      </div>
      <div class="cell" style="width: 100px;">
        <span class="label">伤害</span>
        <span class="sort">
          <i
            class="el-icon-caret-top"
            :class="{ 'is-active': sort === 1 }"
            @click="sortByUp"
          ></i>
          <i
            class="el-icon-caret-bottom"
            :class="{ 'is-active': sort === 0 }"
            @click="sortByDown"
          ></i>
        </span>
      </div>
      <div class="cell" style="width: 200px;">
        <span class="label">操作</span>
      </div>
    </div>
    <template v-if="tableData && tableData.length > 0">
      <div v-for="item of tableData" :key="item.id" class="row">
        <div class="cell" style="width: 100px;">
          <span>{{ item | formatBoss }}</span>
        </div>
        <div class="cell" style="width: 100px;">
          <span>{{ item | formatWeek }}</span>
        </div>
        <div class="cell" style="width: 200px;">
          <span>{{ item | formatStage }}</span>
        </div>
        <div class="cell" style="width: 200px;">
          <el-tooltip placement="right">
            <span slot="content" class="line-up">{{
              item | formatLineUp
            }}</span>
            <span class="line-up">{{ item | formatLineUpSimple }}</span>
          </el-tooltip>
        </div>
        <div class="cell" style="width: 100px;">
          <span>{{ item | formatNumber }}</span>
        </div>
        <div class="cell" style="width: 200px;">
          <router-link :to="`/view-work/${item.id}`" class="link">
            <el-button type="text">查看</el-button>
          </router-link>
          <el-button type="text" @click="editWork(item)">编辑</el-button>
          <el-button type="text" @click="deleteWork(item)">删除</el-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-data">暂无数据</div>
    </template>
  </div>
</template>

<script>
import { deleteWork } from '../../../api';
import { formatNumber } from '../../../utils';
import CHARA_NAME from '../../../CHARA_NAME';
import filters from '../filters';

export default {
  name: 'WorkTable',
  filters,
  data() {
    return {
      sort: -1, // -1 默认 0 降序 1 升序
    };
  },
  computed: {
    tableData() {
      const workList = [...this.$store.state.workList];
      if (this.sort === 1) {
        return workList.sort((p, n) => n.hurt - p.hurt);
      } else if (this.sort === 0) {
        return workList.sort((p, n) => p.hurt - n.hurt);
      }
      return this.$store.state.workList;
    },
  },
  mounted() {
    this.sort = -1;
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
    /**
     * 升序
     */
    sortByUp() {
      if (this.sort === 1) {
        this.sort = -1;
      } else {
        this.sort = 1;
      }
    },
    /**
     * 降序
     */
    sortByDown() {
      if (this.sort === 0) {
        this.sort = -1;
      } else {
        this.sort = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.work-table-container {
  display: inline-flex;
  flex-direction: column;
  font-size: 14px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  .row {
    display: flex;
    align-items: center;
    height: 48px;
    &:hover {
      background-color: #ddd;
    }
    .cell {
      display: flex;
      align-items: center;
      height: 100%;
      border: 1px solid #eee;
      border-left: none;
      border-bottom: none;
      padding-left: 12px;
      .sort {
        display: flex;
        flex-direction: column;
        > i {
          font-size: 14px;
          line-height: 8px;
          cursor: pointer;
          &.is-active {
            color: #409eff;
          }
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
  .link {
    margin-right: 10px;
  }
  .no-data {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}
.line-up {
  line-height: 20px;
  white-space: pre-line;
}
</style>
