<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="品牌名称" prop="brand_id" :rules="rules">
        <!-- <el-input v-model="form.brand_name" /> -->
        <el-select v-model="form.brand_id" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.brand_name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="类别名称" prop="classfiy_name" :rules="rules">
        <el-input v-model="form.classfiy_name" />
      </el-form-item>

      <el-form-item label="url 标题" prop="enTitle" :rules="rules">
        <el-input v-model="form.enTitle" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading"
          >提交</el-button
        >
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getBrandList, addClassfiy, getClassfiyDetail } from "@/api/product";
export default {
  data() {
    return {
      form: {
        brand_id: "",
        classfiy_name: "",
        // sort_num: 0,
      },
      options: [],
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addClassfiy({
            ...this.form,
            enTitle: this.form.enTitle.toLowerCase().replace(/\s*/g, ""),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    brand_id: "",
                    classfiy_name: "",
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
      this.$router.replace("/classfiy");
    },
  },
  mounted() {
    const id = this.$route.query.id;
    id &&
      getClassfiyDetail({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });

    getBrandList().then((res) => {
      if (res.code === 200) {
        this.options = res.data.list;
      }
    });
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
