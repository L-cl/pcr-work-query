<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="作业列表" name="first">
      <div class="filter-options-wrapper">
        <div class="label">高级选项</div>
        <el-form
          ref="form"
          :model="form"
          inline
          label-width="80px"
          class="form"
        >
          <el-form-item label="boss" prop="boss">
            <el-select
              v-model="form.boss"
              placeholder="请选择boss"
              size="small"
              clearable
            >
              <el-option
                v-for="item of options.boss"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="周目" prop="week">
            <el-select
              v-model="form.week"
              placeholder="请选择周目"
              size="small"
              clearable
            >
              <el-option
                v-for="item of options.week"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阶段" prop="stage">
            <el-select
              v-model="form.stage"
              placeholder="请选择阶段"
              size="small"
              clearable
            >
              <el-option
                v-for="item of options.stage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="onQuery" size="mini"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <WorkTable
        v-loading="loading"
        ref="work-table"
        @update="update"
        @edit-work="editWork"
      />
    </el-tab-pane>
    <el-tab-pane label="新增作业" name="second">
      <WorkForm @update="update" :is-edit="isEdit" :work-id="workId" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getWorkList } from '../../api';
import { WorkForm, WorkTable } from './components';

export default {
  name: 'Home',
  components: {
    WorkForm,
    WorkTable,
  },
  asyncData({ store, route }) {
    return store.dispatch('GET_WORK_LIST', {});
  },
  data() {
    return {
      activeName: 'first',
      currentWorkData: {},
      viewWorkVisible: false, // 查看作业弹框状态
      options: {
        boss: [
          {
            value: '1',
            label: '一王',
          },
          {
            value: '2',
            label: '二王',
          },
          {
            value: '3',
            label: '三王',
          },
          {
            value: '4',
            label: '四王',
          },
          {
            value: '5',
            label: '五王',
          },
        ],
        week: [
          {
            value: '1',
            label: '一周目',
          },
          {
            value: '2',
            label: '二周目',
          },
        ],
        stage: [
          {
            value: '1',
            label: '一阶段（非狂暴）',
          },
          {
            value: '2',
            label: '二阶段（狂暴）',
          },
        ],
      },
      form: {
        boss: '',
        week: '', // 周目
        stage: '', // 阶段
      },
      isEdit: false, // 是否是编辑作业
      workId: '', // 作业 id
    };
  },
  watch: {
    activeName(val) {
      if (val === 'first') {
        this.isEdit = false;
        this.workId = '';
      }
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
  methods: {
    /**
     * 查询
     */
    onQuery() {
      this.$store.dispatch('GET_WORK_LIST', this.form);
    },
    /**
     * 更新
     */
    update() {
      this.activeName = 'first';
      this.$store.dispatch('GET_WORK_LIST', this.form);
    },
    /**
     * 编辑作业
     */
    editWork(id) {
      this.activeName = 'second';
      this.isEdit = true;
      this.workId = id;
    },
  },
};
</script>

<style scoped>
.filter-options-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.label {
  color: #606266;
  font-size: 14px;
  min-width: 64px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
