export default {
  /**
   * 设置作业列表
   */
  SET_WORK_LIST(state, data) {
    state.workList = data;
  },
  /**
   * 设置加载状态
   */
  SET_LOADING(state, data) {
    state.loading = data;
  },
  /**
   * 设置单个作业数据
   */
  SET_SINGLE_WORK_DATA(state, data) {
    state.singleWorkData = data;
  },
};
