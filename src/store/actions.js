import { getWorkList, queryWork } from '../api';
import { Message } from 'element-ui';

const handleResponse = (response) => {
  const { code, message, data } = response;
  if (code === 200) {
    return data;
  } else {
    handleError(message);
    return;
  }
};

const handleError = (message) => {
  Message.error(message);
};

const isDef = (v) => {
  return v !== null && v !== undefined;
};

export default {
  /**
   * 获取作业列表
   */
  async GET_WORK_LIST({ commit }, params) {
    commit('SET_LOADING', true);
    const res = await getWorkList(params);
    const data = handleResponse(res);
    if (isDef(data)) {
      commit('SET_WORK_LIST', data);
    }
    commit('SET_LOADING', false);
  },
  /**
   * 查询作业
   */
  async QUERY_SINGLE_WORK_DATA({ commit }, params) {
    commit('SET_LOADING', true);
    const res = await queryWork(params);
    const data = handleResponse(res);
    if (isDef(data)) {
      commit('SET_SINGLE_WORK_DATA', data);
    }
    commit('SET_LOADING', false);
  },
};
