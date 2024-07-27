<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名" prop="username" :rules="rules">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="rules">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="电话" prop="phone" :rules="rules">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="是否为管理员" prop="isAdmin">
        <el-switch v-model="form.isAdmin" />
      </el-form-item>

      <el-form-item label="二维码" prop="qrcodeImg" :rules="rules">
        <div style="display: flex">
          <el-input v-model="form.qrcodeImg" style="margin-right: 30px" />
          <Selectstatic>历史图片和文件</Selectstatic>
        </div>
        <el-upload
          action="#"
          class="avatar-uploader"
          :http-request="uploadCoverImg"
          :show-file-list="false"
          style="margin-top: 10px"
        >
          <el-image
            v-if="form.qrcodeImg"
            :src="form.qrcodeImg"
            class="avatar"
            fit="cover"
            :preview-src-list="[form.qrcodeImg]"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
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
import { upload, editUser, getuserDetail } from "@/api/user";
import Selectstatic from "@/components/Selectstatic";

export default {
  components: { Selectstatic },

  data() {
    return {
      form: {
        username: "",
        password: "",
        qrcodeImg: "",
        isAdmin: false,
        phone: "",
        emial: "",
      },
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  mounted() {
    const id = this.$route.query.id;
    id &&
      getuserDetail({ id }).then((res) => {
        this.form = res.data;
        this.form.password = "";
      });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const form = { ...this.form };
          if (!form.password) {
            delete form.password;
          }
          editUser(form)
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    username: "",
                    password: "",
                    qrcodeImg: "",
                    phone: "",
                    emial: "",
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
      this.$router.replace("/users");
    },
    uploadCoverImg(file) {
      // const _this= this;
      this.uploadImg(file.file, (url) => {
        this.form.cover = url;
      });
    },
    uploadImg(file, insertFn) {
      const imgData = new FormData();
      imgData.append("img", file);
      imgData.append("dirpath", "news");
      console.log(imgData, "file");

      upload(imgData).then((res) => {
        const { url, alt, href } = res.data;
        insertFn && insertFn(process.env.VUE_APP_BASE_API + url, alt, href);
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
  border: 1px dashed #888;
  border-radius: 8px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
// ::v-deep .toolbar {
//   [data-menu-key="group-video"],
//   [data-menu-key="group-image"] {
//     & + .w-e-bar-item-menus-container .w-e-bar-item:nth-of-type(2) {
//       display: none;
//     }
//   }
// }
</style>
