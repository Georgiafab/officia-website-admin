<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="类别名称" prop="classfiy_id" :rules="rules">
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
      <el-form-item label="案例封面" prop="case_image" :rules="rules">
        <div style="display: flex">
          <el-input
            v-model="form.case_image"
            style="margin-right: 30px"
          ></el-input
          ><Selectstatic dirpath="case">历史图片和文件</Selectstatic>
        </div>
      </el-form-item>
      <el-form-item label="案例名称" prop="case_name" :rules="rules">
        <el-input v-model="form.case_name" />
      </el-form-item>
      <el-form-item label="案例副标题" prop="case_subname" :rules="rules">
        <el-input v-model="form.case_subname" />
      </el-form-item>
      <el-form-item label="案例描述" prop="case_desc" :rules="rules">
        <el-input v-model="form.case_desc" />
      </el-form-item>

      <el-form-item label="案例详情banner" prop="case_banner" :rules="rules">
        <div style="display: flex">
          <el-input
            v-model="form.case_banner"
            style="margin-right: 30px"
          ></el-input
          ><Selectstatic dirpath="case">历史图片和文件</Selectstatic>
        </div>
        <el-image
          v-if="form.product_image"
          :src="form.product_image"
          class="avatar"
          :preview-src-list="[form.product_image]"
          fit="cover"
        />
      </el-form-item>

      <el-form-item label="案例url" prop="case_uri" :rules="rules">
        <el-input v-model="form.case_uri" />
      </el-form-item>

      <el-form-item label="内容" prop="content" :rules="rules">
        <div style="border: 1px solid #ccc">
          <Toolbar
            class="toolbar"
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="form.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
      </el-form-item>

      <!-- <div class="product-list">
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
        </el-form-item>

        <Selectstatic dirpath="products">历史图片和文件</Selectstatic>
      </div> -->

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
import { addProduct, getProductDetail, getClassfiyList } from "@/api/product";
import { upload } from "@/api/user";
import Selectstatic from "@/components/Selectstatic";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

export default {
  components: { Selectstatic, Editor, Toolbar },
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
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            customUpload: this.uploadImg,
            customInsert(res, insertFn) {
              console.log(res, "resresres");
            },
          },
          uploadVideo: {
            customUpload: this.uploadImg,
          },
        },
      },
      mode: "default", // or 'simple'
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
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
      getClassfiyList({ size: 1000 }).then((res) => {
        if (res.code === 200) {
          this.classfiyOptions = res.data.list;
        }
      });
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
    this.brandChange();
    const id = this.$route.query.id;
    id &&
      getProductDetail({ id }).then((res) => {
        this.form = res.data;
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
