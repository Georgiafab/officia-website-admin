<template>
  <el-form-item :label="config.label" :prop="config.key">
    <el-input
      v-model="itemVal"
      v-bind="$attrs"
      v-if="config.type === 'input'"
    ></el-input>
    <el-select
      v-model="itemVal"
      clearable
      filterable
      v-bind="$attrs"
      v-else-if="config.type === 'select'"
    >
      <el-option
        v-for="(item, index) in config.options"
        :key="index"
        :label="item"
        :value="index"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: "SearchItem",
  props: {
    config: Object,
    value: [String, Number, Array],
  },
  computed: {
    itemVal: {
      set(val) {
        this.$emit("update:value", val);
      },
      get() {
        return this.value;
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped></style>
