<template>
  <div class="container">
    <el-input
      v-model="value"
      placeholder="请输入机器人名称或者别名"
      @keyup.enter.native="onLogin"
    ></el-input>
    <el-button type="primary" @click="onLogin">登录</el-button>
  </div>
</template>

<script>
import { login } from '../../api/login';

export default {
  name: 'Login',
  data() {
    return {
      value: '', // 输入框的值
    };
  },
  methods: {
    /**
     * 登录
     */
    async onLogin() {
      const params = {
        value: this.value,
      };
      const res = await login(params);
      if (res.code === 200) {
        this.$router.replace({
          path: '/home',
        });
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 320px;
  margin: 30vh auto;
  .el-input {
    margin-bottom: 20px;
  }
  .el-button {
    width: 100%;
  }
}
</style>
