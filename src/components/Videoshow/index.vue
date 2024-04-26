<template>
  <el-dialog title="预览" :visible.sync="dialogVisible" width="50%">
    <video v-if="ty == 'video'" :src="url" controls></video>
    <embed
      v-else-if="ty == 'pdf'"
      :src="url"
      type="application/pdf"
      width="100%"
      height="500px"
    />
  </el-dialog>
</template>
<script>
export default {
  name: "Videoshow",
  props: {
    ty: {
      type: String,
      default: "video",
    },
    url: String,
    show: Boolean,
  },
  computed: {
    dialogVisible: {
      set(val) {
        this.$emit("update:show", val);
      },
      get() {
        return this.show;
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
