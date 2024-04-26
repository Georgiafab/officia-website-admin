<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="新闻banner" prop="news" :rules="rules">
        <div class="ye">
          <el-input v-model="form.news" />
          <el-image
            :src="form.news"
            alt=""
            fit="contain"
            :preview-src-list="[form.news]"
          />
        </div>
      </el-form-item>

      <el-form-item label="联系我们banner" prop="contact" :rules="rules">
        <div class="ye">
          <el-input v-model="form.contact" />
          <el-image
            :src="form.contact"
            alt=""
            fit="contain"
            :preview-src-list="[form.contact]"
          />
        </div>
      </el-form-item>

      <el-form-item label="关于我们banner" prop="abouts" :rules="rules">
        <div class="ye">
          <el-input v-model="form.abouts" />
          <el-image
            :src="form.abouts"
            alt=""
            fit="contain"
            :preview-src-list="[form.abouts]"
          />
        </div>
      </el-form-item>

      <div class="product-list">
        <el-form-item
          v-for="(product, index) in form.products"
          :label="'产品banner' + (index + 1)"
          :key="product.key"
          :prop="'products.' + index + '.value'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <div class="ye">
            <el-input
              v-model="product.value"
              @input="valueChange(product)"
            ></el-input>
            <el-image
              :src="product.value"
              :preview-src-list="[product.value]"
              fit="contain"
              v-if="product.isImage"
            />
            <el-button
              type="success"
              icon="el-icon-video-camera"
              @click="reviewVideo(product)"
              style="margin-left: 20px"
              v-else-if="product.value"
            >
              预览视频
            </el-button>
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="addDomain"
              circle
              style="margin-left: 50px"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :style="{ visibility: !!index ? 'visible' : 'hidden' }"
              @click.prevent="removeDomain(product)"
              circle
            ></el-button>
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
    <Videoshow :url="videoUrl" :show.sync="show" />
  </div>
</template>

<script>
import { getBannerDetail, editBanner } from "@/api/user";
import Videoshow from "@/components/Videoshow";
export default {
  name: "banner",
  components: { Videoshow },
  data() {
    return {
      form: {
        products: [{ value: "", key: 0 }],
        news: "",
        abouts: "",
        contact: "",
      },
      videoUrl: "",
      loading: false,
      show: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  methods: {
    valueChange(item) {
      item.isImage = /.png|.jpg|.svg|.jpeg|.gif|.webp/g.test(item.value);
    },
    removeDomain(item) {
      var index = this.form.products.indexOf(item);
      if (index !== -1) {
        this.form.products.splice(index, 1);
      }
    },
    addDomain() {
      this.form.products.push({
        value: "",
        key: Date.now(),
        isImage: false,
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          editBanner(this.form).then((res) => {
            if (res.code === 200) {
              this.loading = false;
              this.$message({ type: "success", message: "提交成功" });
              // this.$router.replace('/news')
            }
          });
        }
      });
    },
    reviewVideo(item) {
      this.videoUrl = item.value;
      this.show = true;
    },
  },
  mounted() {
    getBannerDetail().then((res) => {
      res.data && (this.form = res.data);
    });
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
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.product-list {
  border: 1px dashed #409eff;
  padding: 30px 10px 30px 0;
  border-radius: 30px;
  margin-bottom: 30px;
  .el-image {
    margin-left: 20px;
    width: auto;
    height: 50px !important;
  }
}
.ye {
  display: flex;
  align-items: center;
  .el-image {
    margin-left: 20px;
    width: 300px;
    height: 50px;
  }
}
</style>
