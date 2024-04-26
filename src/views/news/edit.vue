<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="新闻标题" prop="title" :rules="rules">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="url 标题" prop="enTitle" :rules="rules">
        <el-input v-model="form.enTitle" />
      </el-form-item>
      <el-form-item label="新闻描述" prop="desc" :rules="rules">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>

      <el-form-item label="新闻封面" prop="cover" :rules="rules">
        <div style="display: flex">
          <el-input v-model="form.cover" style="margin-right: 30px"></el-input>
          <Selectstatic dirpath="news">历史图片和文件</Selectstatic>
        </div>
        <el-upload
          action="#"
          class="avatar-uploader"
          :http-request="uploadCoverImg"
          :show-file-list="false"
          style="margin-top: 10px"
        >
          <el-image
            v-if="form.cover"
            :src="form.cover"
            class="avatar"
            fit="cover"
            :preview-src-list="[form.cover]"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="发布时间" prop="time" :rules="rules">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="在首页展示" prop="isHome" :rules="rules">
        <el-switch v-model="form.isHome" />
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
import { getToken } from "@/utils/auth";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { upload, addNew, getnewDetail } from "@/api/user";
import Selectstatic from "@/components/Selectstatic";

export default {
  components: { Editor, Toolbar, Selectstatic },

  data() {
    return {
      form: {
        title: "",
        time: "",
        cover: "",
        desc: "",
        isHome: false,
        content: "",
      },
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
          addNew({
            ...this.form,
            enTitle: this.form.enTitle.toLowerCase().replace(/\s*/g, ""),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message({ type: "success", message: "提交成功" });
                // this.$router.replace('/news')
                if (!this.$route.query.id) {
                  this.form = {
                    title: "",
                    time: "",
                    cover: "",
                    desc: "",
                    isHome: false,
                    content: "",
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
      this.$router.replace("/news");
    },
    uploadCoverImg(file) {
      // const _this= this;
      this.uploadImg(file.file, (url) => {
        this.form.cover = url;
      });
    },
    uploadImg(file, insertFn) {
      let imgData = new FormData();
      imgData.append("img", file);
      imgData.append("dirpath", "news");
      console.log(imgData, "file");

      upload(imgData).then((res) => {
        const { url, alt, href } = res.data;
        insertFn && insertFn(process.env.VUE_APP_BASE_API + url, alt, href);
      });
    },

    //重点来了： 自定义粘贴。可阻止编辑器的默认粘贴，实现自己的粘贴逻辑。(可以实现复制粘贴 word ，有图片)
    customPaste(editor, event, callback) {
      console.log("ClipboardEvent 粘贴事件对象", event);
      let html = event.clipboardData.getData("text/html"); // 获取粘贴的 html
      // let text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
      let rtf = event.clipboardData.getData("text/rtf"); // 获取 rtf 数据（如从 word wsp 复制粘贴）
      var that = this;
      console.log(html, "imgSrcs");
      if (html) {
        // 列表缩进会超出边框，直接过滤掉
        html = html.replace(/text\-indent:\-(.*?)pt/gi, "");

        // 从html内容中查找粘贴内容中是否有图片元素，并返回img标签的属性src值的集合
        const imgSrcs = that.findAllImgSrcsFromHtml(html);

        // 如果有
        if (imgSrcs && Array.isArray(imgSrcs) && imgSrcs.length) {
          // 从rtf内容中查找图片数据
          //   const rtfImageData = that.extractImageDataFromRtf(rtf);

          // 如果找到
          if (rtfImageData.length) {
            // TODO：此处可以将图片上传到自己的服务器上
            console.log(rtfImageData, imgSrcs);

            // 执行替换：将html内容中的img标签的src替换成ref中的图片数据，如果上面上传了则为图片路径
            html = that.replaceImagesFileSourceWithInlineRepresentation(
              html,
              imgSrcs,
              rtfImageData
            );
            editor.dangerouslyInsertHtml(html);
          }
        }

        // 阻止默认的粘贴行为
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    },
    /**
     * 从html代码中匹配返回图片标签img的属性src的值的集合
     * @param htmlData
     * @return Array
     */
    findAllImgSrcsFromHtml(htmlData) {
      let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src

      let arr = htmlData.match(imgReg); //筛选出所有的img
      if (!arr || (Array.isArray(arr) && !arr.length)) {
        return false;
      }

      let srcArr = [];
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        // 获取图片地址
        srcArr.push(src[1]);
      }

      return srcArr;
    },
    /**
     * 从rtf内容中匹配返回图片数据的集合
     * @param rtfData
     * @return Array
     */ extractImageDataFromRtf(rtfData) {
      if (!rtfData) {
        return [];
      }

      const regexPictureHeader =
        /{\\pict[\s\S]+?({\\\*\\blipuid\s?[\da-fA-F]+)[\s}]*/;
      const regexPicture = new RegExp(
        "(?:(" + regexPictureHeader.source + "))([\\da-fA-F\\s]+)\\}",
        "g"
      );
      const images = rtfData.match(regexPicture);
      const result = [];

      if (images) {
        for (const image of images) {
          let imageType = false;

          if (image.includes("\\pngblip")) {
            imageType = "image/png";
          } else if (image.includes("\\jpegblip")) {
            imageType = "image/jpeg";
          }

          if (imageType) {
            result.push({
              hex: image
                .replace(regexPictureHeader, "")
                .replace(/[^\da-fA-F]/g, ""),
              type: imageType,
            });
          }
        }
      }

      return result;
    },
    /**
     * 将html内容中img标签的属性值替换
     * @param htmlData html内容
     * @param imageSrcs html中img的属性src的值的集合
     * @param imagesHexSources rtf中图片数据的集合，与html内容中的img标签对应
     * @param isBase64Data 是否是Base64的图片数据
     * @return String
     */
    replaceImagesFileSourceWithInlineRepresentation(
      htmlData,
      imageSrcs,
      imagesHexSources,
      isBase64Data = true
    ) {
      if (imageSrcs.length === imagesHexSources.length) {
        for (let i = 0; i < imageSrcs.length; i++) {
          const newSrc = isBase64Data
            ? `data:${
                imagesHexSources[i].type
              };base64,${this._convertHexToBase64(imagesHexSources[i].hex)}`
            : imagesHexSources[i];

          htmlData = htmlData.replace(imageSrcs[i], newSrc);
        }
      }

      return htmlData;
    },
    /**
     * 十六进制转base64
     */
    _convertHexToBase64(hexString) {
      return btoa(
        hexString
          .match(/\w{2}/g)
          .map((char) => {
            return String.fromCharCode(parseInt(char, 16));
          })
          .join("")
      );
    },
  },
  mounted() {
    const id = this.$route.query.id;
    id &&
      getnewDetail({ id }).then((res) => {
        console.log(res, "res");
        this.form = res.data;
      });

    // setTimeout(() => {
    //   this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
    // }, 1500);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
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
  border: 1px dashed #888;
  border-radius: 8px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
// ::v-deep .toolbar {
//   [data-menu-key="group-video"],
//   [data-menu-key="group-image"] {
//     & + .w-e-bar-item-menus-container .w-e-bar-item:nth-of-type(2) {
//       display: none;
//     }
//   }
// }
</style>
