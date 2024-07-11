<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="选择页面">
        <el-select v-model="currKey" placeholder="请选择">
          <el-option
            v-for="item in keys"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="title">
        <el-input v-model="form[currKey].title" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="keywords"
        ><el-input v-model="form[currKey].keywords" placeholder="请输入内容"
      /></el-form-item>
      <el-form-item label="description"
        ><el-input
          v-model="form[currKey].description"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getMetaDetail, editMeta } from "@/api/user";
export default {
  data() {
    return {
      keys: ["home", "service", "cases", "about", "contact"],
      form: {
        home: {
          title: "",
          keywords: "",
          describe: "",
        },
        service: {
          title: "",
          keywords: "",
          describe: "",
        },
        cases: {
          title: "",
          keywords: "",
          describe: "",
        },
        about: {
          title: "",
          keywords: "",
          describe: "",
        },
        contact: {
          title: "",
          keywords: "",
          describe: "",
        },
      },
      currKey: "home",
      loading: false,
    };
  },
  mounted() {
    getMetaDetail().then((res) => {
      if (!res.data) return;
      console.log(res.data);
      this.form = res.data;
    });
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          editMeta(this.form).then((res) => {
            if (res.code === 200) {
              this.loading = false;
              this.$message({ type: "success", message: "提交成功" });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
