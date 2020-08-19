<template>
  <div class="container" v-loading="loading">
    <router-link to="/home">
      <el-button size="mini" type="primary" plain>返回</el-button>
    </router-link>
    <div class="content">
      <div class="work-item boss-info">
        <el-table :data="tableData" style="width: 720px" border>
          <el-table-column label="boss" width="100">
            <template slot-scope="{ row }">
              <span>{{ row | formatBoss }}</span>
            </template>
          </el-table-column>
          <el-table-column label="周目" width="100">
            <template slot-scope="{ row }">
              <span>{{ row | formatWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column label="阶段">
            <template slot-scope="{ row }">
              <span>{{ row | formatStage }}</span>
            </template>
          </el-table-column>
          <el-table-column label="阵容" :show-overflow-tooltip="true">
            <template slot-scope="{ row }">
              <el-tooltip placement="right">
                <span slot="content" class="line-up">{{
                  row | formatLineUp
                }}</span>
                <span class="line-up">{{ row | formatLineUpSimple }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="伤害" width="100">
            <template slot-scope="{ row }">
              <span>{{ row | formatNumber }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="work-item boss-work">
        <span class="label">作业：</span>
        <div class="work">{{ work }}</div>
      </div>
      <div class="work-item boss-work-pic">
        <span class="label">图片：</span>
        <template v-if="picUrl.length > 0">
          <el-image
            v-for="url of picUrl"
            :key="url"
            class="img"
            :src="url"
            @click="onPreview(url)"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
        <template v-else>
          <div class="work">暂无数据</div>
        </template>
      </div>
      <PicPreview :visible.sync="picPreviewVisible" :pic-url="currentUrl" />
    </div>
  </div>
</template>

<script>
import { queryWork } from '../../api';
import { PicPreview } from './components';
import filters from './filters';

export default {
  name: 'ViewWork',
  components: {
    PicPreview,
  },
  filters,
  asyncData({ store, route }) {
    const params = {
      id: route.params.id,
    };
    return store.dispatch('QUERY_SINGLE_WORK_DATA', params);
  },
  data() {
    return {
      picPreviewVisible: false, // 查看图片的弹框状态
      currentUrl: '', // 当前点击的图片的 url
    };
  },
  computed: {
    /**
     * 加载中
     */
    loading() {
      return this.$store.state.loading;
    },
    /**
     * 表格数据
     */
    tableData() {
      return [this.$store.state.singleWorkData];
    },
    /**
     * 查询的作业id
     */
    id() {
      return this.$route.params.id;
    },
    /**
     * 查询的作业数据
     */
    singleWorkData() {
      return this.$store.state.singleWorkData;
    },
    /**
     * 作业内容
     */
    work() {
      const { work } = this.singleWorkData;
      return work || '暂无数据';
    },
    /**
     * 作业拖欠
     */
    picUrl() {
      const { picUrl } = this.singleWorkData;
      if (picUrl) {
        return picUrl.split(',');
      }
      return [];
    },
  },
  mounted() {
    this.fetchWorkData();
  },
  methods: {
    /**
     * 获取作业数据
     */
    fetchWorkData() {
      const params = {
        id: this.id,
      };
      this.$store.dispatch('QUERY_SINGLE_WORK_DATA', params);
    },
    /**
     * 预览图片
     */
    onPreview(url) {
      this.currentUrl = url;
      this.picPreviewVisible = true;
    },
  },
};
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
}
.line-up {
  white-space: pre-line;
}
.work-item {
  display: flex;
  margin-bottom: 20px;
  &.boss-info {
    display: block;
  }
}
.label {
  width: 64px;
  text-align: right;
  margin-right: 12px;
}
.work {
  white-space: pre-line;
}
.img {
  width: 300px;
  height: 300px;
  border: 1px solid #ddd;
  cursor: zoom-in;
}
</style>
