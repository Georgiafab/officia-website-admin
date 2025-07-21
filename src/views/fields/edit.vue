<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="字段名称" prop="name" :rules="rules">
        <el-input v-model="form.name" :min="0" />
      </el-form-item>
      <el-form-item label="字段类型" prop="type" :rules="rules">
        <el-select v-model="form.type" placeholder="请选择字段类型">
          <el-option label="文本" value="text" />
          <el-option label="下拉" value="select"/>
        </el-select>
      </el-form-item>
      <el-form-item label="选项" prop="options" v-if="form.type === 'select'">
        <div v-for="(option, index) in form.options" :key="index" style="display: flex; align-items: center; margin-bottom: 10px;">
          <el-input v-model="option.label" placeholder="请输入选项名称" style="margin-right: 10px;" />
          <el-input v-model="option.value" placeholder="请输入选项值" style="margin-right: 10px;" />
          <el-button type="danger" @click="form.options.splice(index, 1)">删除</el-button>
        </div>

        <el-divider v-if="form.options.length > 0" />
        <el-button type="primary" plain @click="form.options.push({ label: '', value: '' })">添加选项</el-button>
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
import { addField, getFieldDetail } from "@/api/user";
// import UpdateInput from "@/components/UpdateInput";
export default {
  // components: { UpdateInput },
  data() {
    return {
      form: {
        name: "",
        type: "",
        options: [],
      },
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  mounted() {
    const id = this.$route.query.id;
    id &&
      getFieldDetail({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addField({
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
      this.$router.replace("/fields");
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
