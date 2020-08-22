<template>
  <div class="view-work-container" v-loading="loading">
    <router-link to="/home">
      <el-button size="mini" type="primary" plain>返回</el-button>
    </router-link>
    <div class="content">
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
          </div>
        </div>
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
        </div>
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
            <div slot="placeholder" class="image-slot" v-loading="true"></div>
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
  asyncData({ store, route, cookie }) {
    const params = {
      id: route.params.id,
    };
    return store.dispatch('QUERY_SINGLE_WORK_DATA', { params, cookie });
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
      this.$store.dispatch('QUERY_SINGLE_WORK_DATA', { params });
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

<style lang="less" scoped>
.view-work-container {
  font-size: 14px;
  .content {
    margin-top: 20px;
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
        .cell {
          display: flex;
          align-items: center;
          height: 100%;
          border: 1px solid #eee;
          border-left: none;
          border-bottom: none;
          padding-left: 12px;
        }
      }
    }
    .work-item {
      display: flex;
      margin-top: 20px;
      &.boss-info {
        display: block;
      }
      .label {
        width: 64px;
        line-height: 20px;
        text-align: right;
        margin-right: 12px;
      }
      .work {
        line-height: 20px;
        white-space: pre-line;
      }
      .img {
        width: 300px;
        height: 300px;
        margin-right: 20px;
        border: 1px solid #ddd;
        cursor: zoom-in;
        .image-slot {
          top: 50%;
        }
      }
    }
  }
}
.line-up {
  line-height: 20px;
  white-space: pre-line;
}
</style>
