<template>
  <div class="ye">
    <el-input v-model="inputValue" @input="valueChange" />
    <el-image
      v-if="isImage"
      :src="inputValue"
      :preview-src-list="[inputValue]"
      fit="cover"
    />
    <el-button
      v-else-if="inputValue"
      type="success"
      icon="el-icon-video-camera"
      style="margin-left: 20px"
      @click="reviewVideo"
    >
      预览视频
    </el-button>
    <Selectstatic :dirpath="dirpath">历史图片和文件</Selectstatic>
    <Videoshow :url="videoUrl" :show.sync="show" />
  </div>
</template>
<script>
import Videoshow from "@/components/Videoshow";
import Selectstatic from "@/components/Selectstatic";
export default {
  name: "UpdateInput",
  components: { Videoshow, Selectstatic },
  props: {
    value: {
      type: String,
      default: "",
    },
    dirpath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputValue: this.value,
      isImage: false,
      show: false,
      videoUrl: "",
    };
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal;
      this.valueChange();
    },
    inputValue(newVal) {
      this.$emit("input", newVal);
    },
  },
  methods: {
    valueChange() {
      this.isImage = /.png|.jpg|.svg|.jpeg|.gif|.webp/g.test(this.inputValue);
    },
    reviewVideo() {
      this.videoUrl = this.inputValue;
      this.show = true;
    },
  },
};
</script>

<style scoped lang="scss">
.ye {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  .el-image {
    margin-left: 20px;
    max-width: 300px;
    height: 50px;
  }
}
</style>
