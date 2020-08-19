import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      loading: false, // 加载中
      workList: [], // 作业列表
      singleWorkData: {}, // 单个作业数据
    },
    actions,
    mutations,
    getters,
  });
}
