<template>
  <div>
    <el-form-item label="">
      <el-button @click="staticLook" type="success"> <slot></slot> </el-button>
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
  },
  watch: {
    $route(to, from) {
      this.staticKey++;
    },
  },
  data() {
    return {
      staticKey: 1,
      dialogVisible: false,
    };
  },
  methods: {
    staticLook() {
      this.dialogVisible = true;
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, dirpath: this.dirpath },
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, dirpath: this.dirpath },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
