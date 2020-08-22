<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px"
    class="form"
    v-loading="submiting || loading"
  >
    <el-form-item label="boss" prop="boss">
      <el-select v-model="form.boss" placeholder="请选择boss" size="small">
        <el-option
          v-for="item of options.boss"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="周目" prop="week">
      <el-select v-model="form.week" placeholder="请选择周目" size="small">
        <el-option
          v-for="item of options.week"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="阶段" prop="stage">
      <el-select v-model="form.stage" placeholder="请选择阶段" size="small">
        <el-option
          v-for="item of options.stage"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="阵容" prop="lineUp">
      <el-select
        v-model="form.lineUp"
        :filterMethod="searchChara"
        placeholder="请选择阵容"
        size="small"
        filterable
        multiple
      >
        <el-option
          v-for="item of charaName"
          :key="item.value"
          :label="item | formatCharaName"
          :value="item.value"
        >
          <el-tooltip :content="item.label" placement="right">
            <span style="width: 100%; display: flex;">{{
              item | formatCharaName
            }}</span>
          </el-tooltip>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="伤害" prop="hurt">
      <el-input
        v-model="form.hurt"
        placeholder="请输入伤害"
        size="small"
      ></el-input>
      <span>{{ form | formatNumber }}</span>
    </el-form-item>
    <el-form-item label="作业" prop="work">
      <el-input
        v-model="form.work"
        :rows="6"
        placeholder="请填写作业"
        type="textarea"
        size="small"
      ></el-input>
    </el-form-item>
    <el-form-item label="作业图片">
      <el-upload
        :on-success="uploadSuccess"
        :on-remove="removePic"
        :action="uploadUrl"
        :file-list="fileList"
        :with-credentials="true"
        ref="upload"
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('form')" size="mini"
        >提交</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import config from '../../../../config';
import { createWork, updateWork } from '../../../api';
import { formatNumber } from '../../../utils';
import CHARA_NAME from '../../../CHARA_NAME';

export default {
  name: 'WorkForm',
  filters: {
    formatCharaName(item) {
      const { label } = item;
      try {
        const labelSplit = label.split(' ');
        return labelSplit[0];
      } catch (error) {
        return '';
      }
    },
    formatNumber(form) {
      const { hurt } = form;
      return formatNumber(hurt, { returnObj: false }) || '';
    },
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    workId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      form: {
        boss: '',
        week: '', // 周目
        stage: '', // 阶段
        lineUp: [], // 阵容
        hurt: '', // 伤害
        work: '', // 作业
      },
      fileList: [], // 上传的图片
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
        charaName: [],
      },
      rules: {
        boss: [{ required: true, message: '请选择boss' }],
        week: [{ required: true, message: '请选择周目' }],
        stage: [{ required: true, message: '请选择阶段' }],
        lineUp: [
          { required: true, message: '请输入阵容' },
          {
            validator: (rule, value, callback) => {
              if (value.length !== 5) {
                callback('阵容有错');
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        hurt: [
          { required: true, message: '请输入伤害' },
          {
            required: true,
            pattern: /^[1-9]\d*|0$/,
            message: '请输入整数',
          },
        ],
      },
      keyword: '', // 搜索的关键字
      submiting: false, // 提交中
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    uploadUrl() {
      return `${config.host}/uploads/pcr/`;
    },
    charaName() {
      return this.options.charaName.filter((item) => {
        return item.label.includes(this.keyword);
      });
    },
    singleWorkData() {
      return this.$store.state.singleWorkData;
    },
    mapSubmitFn() {
      return this.isEdit ? updateWork : createWork;
    },
  },
  watch: {
    async isEdit(val) {
      if (val) {
        const params = {
          id: this.workId,
        };
        await this.$store.dispatch('QUERY_SINGLE_WORK_DATA', { params });
        this.form = { ...this.singleWorkData };
        this.form.lineUp = (this.form.lineUp || '').split(',');
        if (this.form.picUrl) {
          this.fileList = this.form.picUrl.split(',').map((item) => {
            return {
              url: item,
            };
          });
        } else {
          this.fileList = [];
        }
        delete this.form.picUrl;
      } else {
        this.resetForm('form');
      }
    },
  },
  mounted() {
    this.options.charaName = Object.keys(CHARA_NAME).map((key) => {
      const value = key;
      const label = CHARA_NAME[key].join(' ');
      return { value, label };
    });
  },
  methods: {
    /**
     * 提交
     */
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submiting = true;
          const data = { ...this.form };
          data.lineUp = this.form.lineUp.join(',');
          data.picUrl = this.fileList.map((item) => item.url).join(',');
          const res = await this.mapSubmitFn(data);
          if (res.code === 200) {
            this.resetForm(formName);
            this.$emit('update');
            this.$message.success(
              this.isEdit ? '更新作业成功' : '新增作业成功'
            );
          } else {
            this.$message.error(res.message);
          }
          this.submiting = false;
        }
      });
    },
    /**
     * 上传成功的回调
     */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.fileList.push({
          url: res.data,
        });
        this.$message.success('图片上传成功');
      } else {
        this.$message.error(res.message);
      }
    },
    /**
     * 移除图片的回调
     */
    removePic(file, fileList) {
      this.fileList = fileList;
    },
    /**
     * 重置表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$nextTick(() => {
        this.$refs['upload'].clearFiles();
      });
    },
    /**
     * 搜索角色
     */
    searchChara(keyword) {
      this.keyword = keyword;
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  width: 600px;
}
.el-select {
  /deep/ .el-select__tags {
    overflow: auto;
  }
  /deep/ .el-input {
    width: 320px;
  }
}
.el-input {
  width: 320px;
}
</style>
