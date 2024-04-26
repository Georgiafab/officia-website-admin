<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item
        v-for="(item, key) in label"
        :key="key"
        :label="item"
        :prop="key"
        :rules="rules"
      >
        <div class="ye">
          <div style="border: 1px solid #ccc" v-if="key === 'aboutusMsg'">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="editorConfig.toolbarConfig"
              mode="default"
              class="toolbar"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="form.aboutusMsg"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="onCreated"
            />
          </div>
          <el-input v-model="form[key]" v-else />
          <el-image
            :src="form[key]"
            alt=""
            fit="contain"
            :preview-src-list="[form[key]]"
            v-if="imgType.includes(key)"
          />
        </div>
      </el-form-item>
      <el-form-item label="备案" prop="record" :rules="rules">
        <div class="ye">
          <el-input v-model="form.record.value" />
          <el-input
            v-model="form.record.url"
            placeholder="URL"
            style="margin-left: 20px"
          />
        </div>
      </el-form-item>
      <div class="product-list">
        <el-form-item
          v-for="(tel, index) in form.footerTel"
          :label="'底部电话' + (index + 1)"
          :key="tel.key"
          :prop="'footerTel.' + index + '.value'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <div class="ye">
            <el-input v-model="tel.value"></el-input>

            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="addTel"
              circle
              style="margin-left: 50px"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :style="{ visibility: !!index ? 'visible' : 'hidden' }"
              @click.prevent="removeItem(tel, 'footerTel')"
              circle
            ></el-button>
          </div>
        </el-form-item>
      </div>

      <div class="product-list">
        <el-form-item
          v-for="(add, index) in form.footerAdd"
          :label="'底部地址' + (index + 1)"
          :key="add.key"
          :prop="'footerAdd.' + index + '.value'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <div class="ye">
            <el-input v-model="add.value"></el-input>
            <el-input
              v-model="add.url"
              placeholder="地址URL"
              style="margin-left: 20px"
            ></el-input>

            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="addAdd"
              circle
              style="margin-left: 50px"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :style="{ visibility: !!index ? 'visible' : 'hidden' }"
              @click.prevent="removeItem(add, 'footerAdd')"
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
  </div>
</template>

<script>
import { getCompanyDetail, editCompany, upload } from "@/api/user";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
export default {
  name: "company",
  components: { Editor, Toolbar },
  data() {
    return {
      form: {
        name: "",
        englishName: "",
        address: "",
        tel: "",
        phone: "",
        email: "",
        serverTime: "",
        qrcodeImg: "",
        presale: "",
        aftersale: "",
        mapUrl: "",
        aboutusMsg: "",
        wxcode: "",
        qqcode: "",
        copyright: "",
        aboutImg: "",
        footerTel: [{}],
        footerAdd: [{}],
        record: {
          url: "",
          value: "",
        },
        logo1: "",
        logo2: "",
      },
      label: {
        name: "公司名",
        englishName: "公司英文名",
        address: "地址",
        tel: "电话",
        phone: "手机",
        email: "邮件",
        serverTime: "服务时间",
        presale: "售前电话",
        aftersale: "售后电话",
        mapUrl: "地址url",
        aboutusMsg: "关于我们",
        copyright: "copyright",
        aboutImg: "关于我们的图片",
        qrcodeImg: "公众号二维码",
        wxcode: "微信二维码",
        qqcode: "qq二维码",
        fax: "传真",
        postcode: "邮编",
        logo1: "头部logo",
        logo2: "底部logo",
      },
      imgType: ["aboutImg", "wxcode", "qqcode", "qrcodeImg", "logo1", "logo2"],
      editor: null,
      editorConfig: {
        placeholder: "请输入内容...",
        toolbarConfig: {},
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
      options: [],
      loading: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          editCompany(this.form).then((res) => {
            if (res.code === 200) {
              this.loading = false;
              this.$message({ type: "success", message: "提交成功" });
              // this.$router.replace('/news')
            }
          });
        }
      });
    },
    uploadImg(file, insertFn) {
      let imgData = new FormData();
      imgData.append("img", file);
      console.log(imgData, "file");

      upload(imgData).then((res) => {
        const { url, alt, href } = res.data;
        insertFn && insertFn(process.env.VUE_APP_BASE_API + url, alt, href);
      });
    },
    addTel() {
      this.form.footerTel.push({
        value: "",
        key: Date.now(),
      });
    },
    addAdd() {
      this.form.footerAdd.push({
        value: "",
        url: "",
        key: Date.now(),
      });
    },
    removeItem(item, type) {
      var index = this.form[type].indexOf(item);
      if (index !== -1) {
        this.form[type].splice(index, 1);
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
  mounted() {
    getCompanyDetail().then((res) => {
      if (!res.data) return;
      res.data.footerTel = res.data?.footerTel?.length
        ? res.data.footerTel
        : [{}];
      res.data.footerAdd = res.data?.footerAdd?.length
        ? res.data.footerAdd
        : [{}];

      res.data.record = res.data.record || { value: "111", url: "111" };

      this.form = res.data;
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

::v-deep .toolbar {
  [data-menu-key="group-video"],
  [data-menu-key="group-image"] {
    & + .w-e-bar-item-menus-container .w-e-bar-item:nth-of-type(2) {
      display: none;
    }
  }
}
</style>
