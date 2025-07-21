<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="一级模块分类" prop="brand_id" :rules="rules">
        <el-select
          v-model="form.brand_id"
          filterable
          placeholder="请选择"
          @change="brandChange"
        >
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.brand_id"
        label="二级模板分类"
        prop="classfiy_id"
        :rules="rules"
      >
        <el-select v-model="form.classfiy_id" placeholder="请选择">
          <el-option
            v-for="item in classfiyOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" prop="name" :rules="rules">
        <div v-for="language in languages" :key="language.key" style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="margin-right: 10px; width: 100px;">{{ language.value }}  :</span>
          <el-input v-model="form.name[language.key]" @change="changeName(language.key, $event)" :placeholder="language.value" />
        </div>
      </el-form-item>
      <el-checkbox  v-model="form.isCreateFolder" label="使用模版名称创建文件夹(仅限英文名称,没有勾选或者英文名称不合法则使用默认文件夹名template ) , 创建的时候会把所有非英文字母字符去除" style="margin-bottom: 30px; margin-left: 140px;" :disabled="!form.name['en']" />

      <el-form-item label="排序" prop="sort" :rules="rules">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>

      <el-form-item label="图片" prop="image" :rules="rules">
        <UpdateInput v-model="form.image" :dirpath="dirpath" fieldId="image" />
      </el-form-item>
      <el-form-item label="模板封面视频" prop="cover" :rules="rules">
        <UpdateInput v-model="form.cover" :dirpath="dirpath" fieldId="cover" />
      </el-form-item>
      <el-form-item label="视频" prop="video" :rules="rules">
        <UpdateInput v-model="form.video" :dirpath="dirpath" fieldId="video" />
      </el-form-item>
      <el-form-item label="模板提示词" prop="reminder">
        <el-input
          v-model="form.reminder"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>

      <el-form-item :label="item.name" :data-key="item._id" :data-data="form.fields[item._id]" prop="fields" v-for="(item, index) in fields" :key="item._id">
          <el-select v-model="form.fields[item._id]" @change="changeField(item._id, $event)" placeholder="请选择" v-if="item.type === 'select'" clearable>
            <el-option v-for="op in item.options" :key="op.value" :label="op.label" :value="op.value" />
          </el-select>
          <el-input v-model="form.fields[item._id]" @change="changeField(item._id, $event)" placeholder="请输入" v-else />
      </el-form-item>

      <el-form-item label="开启产品（勾选产品端口）" prop="product">
        <el-checkbox-group v-model="form.product" >
          <el-checkbox v-for="item in productOptions" :key="item.value" :label="item.value" :value="item.value" >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

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
import {
  addProduct,
  getProductDetail,
  getClassfiyList,
  getBrandList,
  getProList
} from "@/api/product";
import { upload, listFields,getLanguages } from "@/api/user";
// import Selectstatic from "@/components/Selectstatic";
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// import "@wangeditor/editor/dist/css/style.css";
import UpdateInput from "@/components/UpdateInput";

export default {
  components: { UpdateInput },
  data() {
    return {
      form: {
        brand_id: "",
        classfiy_id: "",
        name: {},
        sort: 0,
        image: "",
        video: "",
        reminder: "",
        fields: {},
        isCreateFolder: false,
        product: [],
        open: true,
        // sort_num: 0,
      },
      fields: [],
      productOptions: [],
      languages: [],
      options: [],
      classfiyOptions: {},
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

  computed: {
    dirpath() {
      console.log(this.form.name, "this.form.name");
      const enName = this.form.name?.['en']?.replace(/[^a-zA-Z]/g, '')
      return this.form.isCreateFolder && enName ? `${enName}` : 'template'
    }
  },

  mounted() {
    const id = this.$route.query.id;

    console.log(id, "id");
    this.brandChange();
    listFields({size: 1000}).then((res) => {
      if (res.code === 200) {
        this.fields = res.data.list;
        this.fields.forEach(item => {
          this.$set(this.form.fields, item._id, this.form.fields[item._id] || ""); // 使用 $set 确保响应式
        });
      }
    });
    getLanguages({ size: 1000 }).then((res) => {
      if (res.code === 200) {
        this.languages = res.data.list;
        this.languages.forEach(item => {
          this.$set(this.form.name, item.key, this.form.name[item.key] || ""); // 使用 $set 确保响应式
        });
        id &&
      getProductDetail({ id }).then((res) => {
        this.form = res.data;
        this.$set(this.form, 'fields', res.data.fields);
        this.$set(this.form, 'name', res.data.name);
        this.$set(this.form, 'product', res.data.product);
      });
      }
    });
    getProList({ size: 1000 }).then((res) => {
      if (res.code === 200) {
        console.log(res.data.list, "res.data.list");
        this.productOptions = res.data.list.map(item => ({
          label: item.name,
          value: item._id
        }));
      }
    });
    getBrandList().then((res) => {
      if (res.code === 200) {
        this.options = res.data.list;
      }
    });
  },
  methods: {
    changeName(key, value) {
      this.$set(this.form.name, key, value);
      console.log(this.form.name[key], "this.form.name");
    },
    changeField(id, value) {
      this.$set(this.form.fields, id, value);
      console.log(this.form.fields[id], "this.form.fields");
    },
    onCreated(editor) {
      // this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
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
                    brand_id: "",
                    classfiy_id: "",
                    name: {},
                    sort: 0,
                    image: "",
                    video: "",
                    reminder: "",
                    fields: {},
                    isCreateFolder: false,
                    open: true,
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
      const imgData = new FormData();
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
      this.$router.replace("/case");
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
};
</script>

<style scoped>
.line {
  text-align: center;
}

.classify-grop {
  display: flex;
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
