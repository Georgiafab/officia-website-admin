<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="品牌" prop="brand_id" :rules="rules">
        <el-select
          filterable
          @change="brandChange"
          v-model="form.brand_id"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.brand_name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.brand_id"
        label="类别名称"
        prop="classfiy_id"
        :rules="rules"
      >
        <el-select v-model="form.classfiy_id" placeholder="请选择">
          <el-option
            v-for="item in classfiyOptions"
            :key="item._id"
            :label="item.classfiy_name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="产品名称" prop="product_name" :rules="rules">
        <el-input v-model="form.product_name" />
      </el-form-item>

      <!-- <el-form-item label="产品名称" prop="product_name" :rules="rules">
        <el-input v-model="form.product_name" />
      </el-form-item> -->

      <el-form-item label="产品图片" prop="product_image" :rules="rules">
        <div style="display: flex">
          <el-input
            v-model="form.product_image"
            style="margin-right: 30px"
          ></el-input
          ><Selectstatic dirpath="products">历史图片和文件</Selectstatic>
        </div>
        <!-- <el-upload
          action="#"
          class="avatar-uploader"
          :http-request="uploadProductImg"
          :show-file-list="false"
        > -->
        <el-image
          v-if="form.product_image"
          :src="form.product_image"
          class="avatar"
          :preview-src-list="[form.product_image]"
          fit="cover"
        />
        <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        <!-- </el-upload> -->
      </el-form-item>

      <div class="product-list">
        <el-form-item
          v-for="(pdf, index) in form.detail_pdf"
          :label="'产品pdf' + (index + 1)"
          :key="pdf.key"
          :prop="'detail_pdf.' + index + '.url'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <div class="ye">
            <el-input v-model="pdf.url"></el-input>

            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="addPdf"
              circle
              style="margin-left: 50px"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :style="{ visibility: !!index ? 'visible' : 'hidden' }"
              @click.prevent="removeItem(pdf)"
              circle
            ></el-button>
          </div>
          <!-- <el-input v-for="item in form.detail_pdf" :value="item" :key="item"></el-input> -->
        </el-form-item>

        <Selectstatic dirpath="products">历史图片和文件</Selectstatic>
        <!-- <el-form-item>
          <el-upload
            action="#"
            :http-request="uploadProductPdf"
            :before-remove="beforeRemove"
            :on-remove="handleRemove"
            multiple
            :show-file-list="false"
            style="margin-top: 10px"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item> -->
      </div>

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
import {
  getBrandList,
  addProduct,
  getProductDetail,
  getClassfiyList,
} from "@/api/product";
import { upload } from "@/api/user";
import Selectstatic from "@/components/Selectstatic";

export default {
  components: { Selectstatic },
  data() {
    return {
      form: {
        brand_id: "",
        classfiy_id: "",
        product_name: "",
        product_image: "",
        detail_pdf: [{ value: "", uid: 0 }],
        // sort_num: 0,
      },
      options: [],
      classfiyOptions: [],
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          addProduct(this.form)
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    bbrand_id: "",
                    classfiy_id: "",
                    product_name: "",
                    product_image: "",
                    detail_pdf: [{ value: "", uid: 0 }],
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      this.form.detail_pdf = fileList;
    },
    uploadImg(file, insertFn) {
      let imgData = new FormData();
      imgData.append("img", file);
      // console.log(file, imgData)
      upload(imgData).then((res) => {
        const { url, alt, href } = res.data;
        insertFn && insertFn(process.env.VUE_APP_BASE_API + url, alt, href);
      });
    },
    uploadProductPdf(file) {
      this.uploadImg(file.file, (url, name) => {
        this.form.detail_pdf.push({ url, name });
      });
    },
    uploadProductImg(file) {
      // const _this= this;
      this.uploadImg(file.file, (url) => {
        this.form.product_image = url;
      });
    },
    onCancel() {
      this.$router.replace("/product");
    },
    brandChange() {
      getClassfiyList({ brand_id: this.form.brand_id, size: 1000 }).then(
        (res) => {
          if (res.code === 200) {
            this.classfiyOptions = res.data.list;
          }
        }
      );
    },
    addPdf() {
      this.form.detail_pdf.push({
        url: "",
        uid: Date.now(),
      });
    },
    removeItem(item) {
      var index = this.form.detail_pdf.indexOf(item);
      if (index !== -1) {
        this.form.detail_pdf.splice(index, 1);
      }
    },
  },

  mounted() {
    const id = this.$route.query.id;
    id &&
      getProductDetail({ id }).then((res) => {
        this.form = res.data;
        this.brandChange();
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

.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
}

.ye {
  display: flex;
  align-items: center;
}
</style>
