<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="类别分类名称" prop="brand_id" :rules="rules">
        <!-- <el-input v-model="form.brand_name" /> -->
        <el-select v-model="form.brand_id" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="类别名称" prop="name" :rules="rules">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="类别副标题" prop="subname" :rules="rules">
        <el-input v-model="form.subname" />
      </el-form-item>
      <el-form-item label="排序" prop="sort" :rules="rules">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>
      <el-form-item label="类别图片" prop="image_src" :rules="rules">
        <div style="display: flex">
          <el-input v-model="form.image_src" style="margin-right: 30px" />
          <el-image :src="form.image_src" />
          <Selectstatic dirpath="template">历史图片和文件</Selectstatic>
        </div>
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
import { getBrandList, addClassfiy, getClassfiyDetail } from "@/api/product";
import Selectstatic from "@/components/Selectstatic";
export default {
  components: { Selectstatic },
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
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addClassfiy({
            ...this.form,
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
        } else {
          this.loading = false;
        }
      });
    },
    onCancel() {
      this.$router.replace("/classfiy");
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
