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
        <div v-for="language in languages" :key="language.key" style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="margin-right: 10px; width: 100px;">{{ language.value }}  :</span>
          <el-input v-model="form.name[language.key]" @change="changeName(language.key, $event)" :placeholder="language.value" />
        </div>
      </el-form-item>

      <!-- <el-form-item label="类别副标题" prop="subname" :rules="rules">
        <el-input v-model="form.subname" />
      </el-form-item> -->
      <el-form-item label="排序" prop="sort" :rules="rules">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>
      <!-- <el-form-item label="类别图片" prop="image_src" :rules="rules">
        <UpdateInput v-model="form.image_src" dirpath="template"
          >历史图片和文件</UpdateInput
        >
      </el-form-item> -->
      <el-form-item label="是否开启" prop="open">
        <el-switch v-model="form.open" />
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
import { getLanguages } from "@/api/user";
import { getBrandList, addClassfiy, getClassfiyDetail } from "@/api/product";
// import UpdateInput from "@/components/UpdateInput";
export default {
  // components: { UpdateInput },
  data() {
    return {
      form: {
        brand_id: "",
        name: {},
        open: true,
        // sort_num: 0,
      },
      options: [],
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  mounted() {
    const id = this.$route.query.id;
    getBrandList().then((res) => {
      if (res.code === 200) {
        this.options = res.data.list;
      }
    });
    getLanguages({ size: 1000 }).then((res) => {
      if (res.code === 200) {
        this.languages = res.data.list;
        this.languages.forEach(item => {
          this.$set(this.form.name, item.key, this.form.name[item.key] || ""); // 使用 $set 确保响应式
        });

        id &&
      getClassfiyDetail({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
        this.$set(this.form, 'name', res.data.name);
      });
      }
    });
  },
  methods: {
    changeName(key, value) {
      this.$set(this.form.name, key, value);
      console.log(this.form.name[key], "this.form.name");
    },
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
                    open: true,
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
