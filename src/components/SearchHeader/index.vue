<template>
  <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
    <SearchItem
      v-for="item in config"
      :key="item.key"
      :value.sync="form[item.key]"
      :config="item"
      v-bind="item.attrs"
    />
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import SearchItem from "./SearchItem.vue";
export default {
  name: "SearchHeader",
  components: { SearchItem },
  props: {
    config: Array,
  },
  emits: ["onSubmit"],
  data() {
    return {
      form: {},
    };
  },
  watch: {
    config: {
      handler(val) {
        val.forEach((item) => {
          this.$set(this.form, item.key, null);
        });
      },
      immediate: true,
      // deep: true,
    },
  },
  methods: {
    onSubmit() {
      this.$emit("onSubmit", this.form);
    },
    onReset() {
      this.$refs.form.resetFields();
      this.$emit("onSubmit", this.form);
    },
  },
};
</script>
<style lang="scss" scoped></style>
