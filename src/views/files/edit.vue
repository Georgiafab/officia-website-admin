<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="键" prop="key" :rules="rules">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="配置类型" prop="type" :rules="rules">
        <el-radio-group v-model="form.type">
          <el-radio label="键值对">键值对</el-radio>
          <el-radio label="文件">文件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品" prop="product" :rules="rules">
        <el-select v-model="form.product" placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文件" prop="filepath" :rules="rules">
        <UpdateInput v-model="form.filepath" dirpath="products"
          >点击上传文件</UpdateInput
        >
      </el-form-item>
      <el-form-item label="自定义描述" prop="desc">
        <el-input v-model="form.desc" />
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
import { addFilePro, getFileProDetail } from "@/api/user";
import { getProList } from "@/api/product";

import UpdateInput from "@/components/UpdateInput";
export default {
  components: { UpdateInput },
  data() {
    return {
      form: {
        type: "文件",
      },
      list: [],
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  mounted() {
    const id = this.$route.query.id;
    id &&
      getFileProDetail({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });

    getProList().then((res) => {
      this.list = res.data.list;
    });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addFilePro({
            ...this.form,
            // enTitle: this.form.enTitle.toLowerCase().replace(/\s*/g, ""),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    type: "文件",
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
      this.$router.replace("/files");
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
