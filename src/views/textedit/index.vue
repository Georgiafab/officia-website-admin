<template>
  <div class="page">
    <iframe
      id="testIframe"
      :src="`${baseUrl}/${username}`"
      frameborder="
      0"
      name="test"
      width="100%"
      height="100vh"
      class="pageiframe"
    />

    <el-button type="danger" class="save" :loading="loading" @click="handleSave"
      >保 存 修 改</el-button
    >

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      ><el-input
        v-model="textarea"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(() => (dialogVisible = false))"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editContent } from "@/api/user";
export default {
  data() {
    return {
      dialogVisible: false,
      textarea: "",
      currKey: "",
      content: {},
      loading: false,
      baseUrl: process.env.VUE_APP_BASE_API || location.origin,
    };
  },
  computed: {
    username() {
      return this.$store.state.user.name;
    },
  },
  mounted() {
    const test = document.getElementById("testIframe");
    const _this = this;
    test.onload = function () {
      test.contentWindow.postMessage("edit", _this.baseUrl);
    };

    window.addEventListener("message", (e) => {
      if (e.origin === _this.baseUrl && e.data.type === "webtextedit") {
        this.currKey = e.data.key;
        this.textarea = e.data.content;
        this.dialogVisible = true;
      }
    });
  },
  methods: {
    handleComfirm() {
      this.$set(this.content, this.currKey, this.textarea);
      this.handleClose();
      this.dialogVisible = false;
    },
    handleSave() {
      this.loading = true;
      editContent({ content: this.content }).then((res) => {
        this.$message({ type: "success", message: "提交成功" });
        this.loading = false;
      });
    },
    handleClose(done) {
      const test = document.getElementById("testIframe");
      const _this = this;
      test.contentWindow.postMessage(
        { type: "quit", val: { key: this.currKey, content: this.textarea } },
        _this.baseUrl
      );
      done && done();
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then((_) => {
    //       done();
    //     })
    //     .catch((_) => {});
    // },
  },
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
}
.pageiframe {
  height: 100vh;
}
.save {
  position: fixed;
  right: 0;
  top: 50%;
}
</style>
