<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="排序" prop="sort" :rules="rules">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>
      <el-form-item label="图片" prop="image_src" :rules="rules">
        <UpdateInput v-model="form.image_src" dirpath="banner"
          >历史图片和文件</UpdateInput
        >
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
import { addBanner, getbannerDetaill } from "@/api/user";
import UpdateInput from "@/components/UpdateInput";
export default {
  components: { UpdateInput },
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
    const id = this.$route.query.id;
    id &&
      getbannerDetaill({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addBanner({
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
      this.$router.replace("/banner");
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
