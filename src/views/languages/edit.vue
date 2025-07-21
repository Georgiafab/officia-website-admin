<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Key" prop="key" :rules="rules">
        <el-input v-model="form.key" :min="0" />
      </el-form-item>
      <el-form-item label="名称" prop="value" :rules="rules">
        <el-input v-model="form.value" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit"
          >提交</el-button
        >
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addLanguages, getLanguagesDetail } from "@/api/user";
// import UpdateInput from "@/components/UpdateInput";
export default {
  // components: { UpdateInput },
  data() {
    return {
      form: {
        image_src: "",
        sort: 0,
      },
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  mounted() {
    const key = this.$route.query.key;
    key &&
      getLanguagesDetail({ key }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addLanguages({
            ...this.form,
            // enTitle: this.form.enTitle.toLowerCase().replace(/\s*/g, ""),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    image_src: "",
                    sort: 0,
                  };
                }
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    onCancel() {
      this.$router.replace("/languages");
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
