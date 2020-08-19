<template>
  <el-dialog :visible="visible" :before-close="closeDialog" append-to-body>
    <img width="100%" :src="picUrl" alt="" />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    picUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
