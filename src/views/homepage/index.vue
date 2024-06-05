<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="200px">
      <!-- banner -->
      <div class="product-list">
        <el-form-item
          v-for="(banner, index) in form.banner"
          :label="'首页banner' + (index + 1)"
          :key="banner.key"
          :prop="'banner.' + index + '.value'"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'blur',
          }"
        >
          <div class="ye">
            <el-input
              v-model="banner.value"
              @input="valueChange(banner)"
            ></el-input>
            <el-image
              :src="banner.value"
              :preview-src-list="[banner.value]"
              fit="contain"
              v-if="banner.isImage"
            />
            <el-button
              type="success"
              icon="el-icon-video-camera"
              @click="reviewVideo(banner)"
              style="margin-left: 20px"
              v-else-if="banner.value"
            >
              预览视频
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click.prevent="form.banner.splice(index, 1)"
              circle
            ></el-button>
          </div>
        </el-form-item>
        <el-button
          @click="
            form.banner.push({
              value: '',
              key: Date.now(),
              isImage: false,
            })
          "
          style="margin-left: 50px"
          >添加banner</el-button
        >
      </div>
      <!-- banner end -->

      <div class="product-list">
        <el-form-item
          l-form-item
          label="section1 标题"
          prop="section1"
          :rules="rules"
        >
          <div class="ye">
            <el-input v-model="form.section1.title" />
          </div>
        </el-form-item>

        <el-form-item
          v-for="(item, index) in form.section1.content"
          :label="'内容' + (index + 1)"
          :key="item.key"
          :prop="'content.' + index + '.value'"
        >
          <div class="product-list" style="padding-left: 20px">
            <div class="ye">
              <el-input v-model="item.img" placeholder="图片"></el-input>
              <el-image
                :src="item.img"
                :preview-src-list="[item.img]"
                fit="contain"
              />
            </div>
            <div>
              <el-input v-model="item.name" placeholder="name:"></el-input>
              <el-input v-model="item.desc" placeholder="desc:"></el-input>
              <el-input v-model="item.list" placeholder="list:"></el-input>
            </div>
          </div>

          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.prevent="form.section1.content.splice(index, 1)"
            circle
          ></el-button>
        </el-form-item>
        <el-button
          @click="
            form.section1.content.push({
              img: '',
              name: '',
              desc: '',
              list: '',
            })
          "
          style="margin-left: 50px"
          >添加内容</el-button
        >
      </div>

      <el-form-item label="案例列表">
        <el-select v-model="form.caseList" multiple placeholder="请选择">
          <el-option
            v-for="item in caseOptions"
            :key="item._id"
            :label="item.case_name"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主要客户列表">
        <div
          v-for="(item, index) in form.client.majorClientList"
          :key="index"
          class="product-list"
          style="padding: 20px"
        >
          <div style="display: flex; align-items: center">
            <el-input
              type="text"
              v-model="item.imgUrl"
              placeholder="图片链接"
            />
            <el-image
              style="width: 100px; height: 100px"
              :src="item.imgUrl"
              fit="contain"
            ></el-image>
          </div>
          <el-input v-model="item.clientDesc" placeholder="客户描述"></el-input>
          <el-input v-model="item.clientName" placeholder="客户名称"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="客户列表">
        <div class="product-list" style="padding: 20px">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 20px 20px;
              padding: 10px 0;
            "
            v-for="(item, index) in form.client.clientList"
            :key="index"
          >
            <el-input
              type="text"
              v-model="item.imgUrl"
              placeholder="图片链接"
            />
            <el-image
              style="width: 100px; height: 100px"
              :src="item.imgUrl"
              fit="contain"
            ></el-image>
            <el-button @click="form.client.clientList.splice(index, 1)">
              删除</el-button
            >
          </div>
          <el-button @click="form.client.clientList.push({ imgUrl: '' })">
            添加</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="新闻">
        <el-select v-model="form.news" multiple placeholder="请选择">
          <el-option
            v-for="item in newsOptions"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

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
import { getIndexDetail, editIndex, getnewList } from "@/api/user";
import { getProductList } from "@/api/product";
import Videoshow from "@/components/Videoshow";
export default {
  name: "homepage",
  components: { Videoshow },
  data() {
    return {
      form: {
        banner: [{ value: "", key: 0 }],
        section1: {
          title: "",
          content: [
            {
              img: "",
              name: "",
              desc: "",
              list: "",
            },
          ],
        },
        news: [],
        abouts: "",
        contact: "",
        caseList: null,
        client: {
          majorClientList: [
            {
              imgUrl: "",
              clientDesc: "",
              clientName: "",
            },
            {
              imgUrl: "",
              clientDesc: "",
              clientName: "",
            },
            {
              imgUrl: "",
              clientDesc: "",
              clientName: "",
            },
          ],
          clientList: [],
          newsOptions: [],
        },
      },
      videoUrl: "",
      loading: false,
      show: false,
      rules: { required: true, message: "该字段必填", trigger: "blur" },
      caseOptions: [],
    };
  },
  methods: {
    valueChange(item) {
      item.isImage = /.png|.jpg|.svg|.jpeg|.gif|.webp/g.test(item.value);
    },
    removeDomain(item, type) {
      var index = this.form[type].indexOf(item);
      if (index !== -1) {
        this.form[type].splice(index, 1);
      }
    },
    addDomain(obj) {
      obj.push({
        value: "",
        key: Date.now(),
        isImage: false,
      });
    },
    onSubmit() {
      console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          editIndex(this.form).then((res) => {
            this.loading = false;
            if (res.code === 200) {
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
    getIndexDetail().then((res) => {
      res.data && (this.form = res.data);
    });
    getProductList({ size: 10000 }).then((res) => {
      this.caseOptions = res.data.list;
    });
    getnewList({ size: 10000 }).then((res) => {
      this.newsOptions = res.data.list;
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
  // .el-image {
  //   margin-left: 20px;
  //   width: auto;
  //   height: 50px !important;
  // }
}
.ye {
  display: flex;
  align-items: center;
}
.el-image {
  margin-left: 20px;
  width: 300px !important;
  height: 50px !important;
}
.flex {
  display: flex;
}
</style>
