<template>
  <div>
    <el-form-item label="">
      <el-button type="success" @click="staticLook"> <slot /> </el-button>
    </el-form-item>

    <el-dialog
      title="静态资源管理"
      :visible.sync="dialogVisible"
      width="1200px"
      @close="dialogClose"
    >
      <dashboard
        :key="staticKey"
        :select="true"
        dirpath="products"
        :currpath="$route.hash"
        :change="handleChange"
      />
    </el-dialog>
  </div>
</template>
<script>
import dashboard from "@/views/dashboard/index.vue";
export default {
  name: "Selectstatic",
  components: { dashboard },
  props: {
    dirpath: String,
    change: {
      type: Function,
      default: () => {},
    },
    fieldId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      staticKey: 1,
      dialogVisible: false,
    };
  },
  watch: {
    $route(to, from) {
      this.staticKey++;
    },
  },
  mounted() {
    // this.$router.push({
    //   path: this.$route.path,
    //   query: { ...this.$route.query, dirpath: this.dirpath },
    // });
  },
  methods: {
    staticLook() {
      this.dialogVisible = true;
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, dirpath: this.dirpath, fieldId: this.fieldId },
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, dirpath: this.dirpath, fieldId: this.fieldId },
      });
    },
    handleChange(url) {
      console.log(url, "url将dashboard的change事件传递给父组件");
      console.log("this.change function:", this.change);
      // 将dashboard的change事件传递给父组件
      this.change(url);
      // 选择完成后关闭对话框
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
