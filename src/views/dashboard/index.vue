<template>
  <div class="dashboard-container">
    <div class="top">
      <h2>静态资源管理</h2>
      <el-upload
        action="#"
        :http-request="beforeUpload"
        :data="{ utype: 'new' }"
        multiple
      >
        <el-button type="success" size="small">在当前路径中上传文件</el-button>
      </el-upload>
      <el-button
        type="primary"
        size="small"
        style="margin-left: 10px"
        @click="handleAddDir"
        >在当前路径中新建文件夹</el-button
      >
    </div>
    <el-divider></el-divider>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        :to="{ path: currpath, query: { ...$route.query, dirpath: '' } }"
        >资源管理</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-for="item in pathList"
        :key="item.path"
        :to="{
          path: currpath,
          query: { ...$route.query, dirpath: item.path },
        }"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-input
      placeholder="在当前文件夹下查找"
      v-model="search"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>

    <!-- <input type="text" name="" placeholder=""> -->

    <ul class="file-list">
      <el-checkbox-group v-model="checkedCities">
        <li
          :class="item.type"
          v-for="item in fileList"
          :key="item.title + item.hash"
          @dblclick="dirClick(item.type, item.title)"
        >
          <div class="right">
            <el-checkbox :label="item.path"></el-checkbox>
            <div class="type">
              <el-image
                v-if="item.type === 'img'"
                style="width: 50px; height: 50px"
                :src="`${path}${item.path}?v=${item.hash}`"
                fit="cover"
                lazy
                :preview-src-list="[`${path}${item.path}?v=${item.hash}`]"
              >
              </el-image>
              <!-- <img :src="" alt="" > -->
              <i
                v-else-if="item.type == 'dir'"
                class="el-icon-folder-opened"
              ></i>
              <i v-else-if="item.type == 'file'" class="el-icon-tickets"></i>
              <i
                v-else-if="item.type == 'pdf'"
                class="el-icon-collection"
                @click="
                  reviewVideo(`${path}${item.path}?v=${item.hash}`, 'pdf')
                "
              ></i>
              <i
                v-else-if="item.type == 'video'"
                class="el-icon-video-camera"
                @click="
                  reviewVideo(`${path}${item.path}?v=${item.hash}`, 'video')
                "
              ></i>
            </div>

            {{ item.title }}
            <span
              style="font-size: 14px; color: #409eff; padding-left: 20px"
              v-if="item.type != 'dir'"
            >
              ({{ item.size }})</span
            >
          </div>
          <div class="center">{{ item.update_time }}</div>
          <div class="left">
            <el-button
              v-if="item.type !== 'dir'"
              type="success"
              v-clipboard="`${path}${item.path}?v=${item.hash}`"
              v-clipboard:success="clipboardSuccessHandler"
              size="small"
              >复制</el-button
            >
            <el-button type="danger" @click="delItem(item)" size="small"
              >删除</el-button
            >
            <div class="repalce" v-if="item.type !== 'dir'">
              <el-upload
                action="#"
                :http-request="beforeUpload"
                :ref="`upload`"
                :data="{ ...item, utype: 'replace' }"
              >
                <el-button type="warning" size="small">替换</el-button>
              </el-upload>
              <!-- class="repalce-inpt" -->
              <!-- <input
                type="file"
                name="file"
                @change="replaceItem(item, $event)"
                :id="`replaceInp${index}`"
                class="repalce-inpt"
              />
              <el-button
                @click="beforeReplace(item, index)"
                type="warning"
                size="small"
                >替换</el-button
              > -->
            </div>
          </div>
        </li>
      </el-checkbox-group>
    </ul>
    <Videoshow :url="videoUrl" :show.sync="show" :ty="ty" />

    <el-dialog title="请选择图片压缩等级" :visible.sync="dialogVisible">
      <p>
        等级越低压缩强度越强（太低可能会失真）<strong style="color: red"
          ><i>只会作用于图片</i></strong
        >
      </p>
      <el-form>
        <el-form-item label-width="120">
          <el-slider
            v-model.number="quality"
            :step="10"
            :min="10"
            :max="60"
            show-stops
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消上传</el-button>
        <el-button type="warning" @click="qualityComfig(false)"
          >不压缩</el-button
        >
        <el-button type="primary" @click="qualityComfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFileList, delFile, replaceFile, upload, addDir } from "@/api/user";
import Videoshow from "@/components/Videoshow";
export default {
  name: "Dashboard",
  components: { Videoshow },
  props: {
    dirpath: String,
    currpath: {
      type: String,
      default: "/",
    },
    select: Boolean,
  },
  data() {
    return {
      // fileList: {},
      allFileList: [],
      path: process.env.VUE_APP_BASE_API + "/",
      pathList: [],
      search: "",
      checkedCities: [],
      videoUrl: "",
      show: false,
      ty: "",
      quality: 40,
      dialogVisible: false,
      currFile: null,
      type: "new",
      isCompress: true,
      imageType: "png" | "jpg" | "jpeg" | "gif" | "bmp" | "raw",
    };
  },
  computed: {
    fileList() {
      if (this.search) {
        return this.allFileList.filter((item) =>
          item.title.includes(this.search)
        );
      }
      return this.allFileList;
    },
  },
  methods: {
    dirClick(type, title) {
      if (type !== "dir") {
        return;
      }
      const dirpath = this.$route.query.dirpath;
      const path = `${dirpath ? dirpath + "/" : ""}${title}`;
      this.$router.push({
        path: this.current,
        query: { ...this.$route.query, dirpath: path },
      });
    },
    fetchData() {
      const dirpath = this.$route.query.dirpath;
      getFileList({ dirpath }).then((res) => {
        if (res.code === 200) {
          this.allFileList = res.data.map((item) => {
            return {
              ...item,
              hash: new Date().getTime(),
            };
          });
        }
      });
    },
    beforeUpload(file) {
      this.currFile = file;
      this.dialogVisible = true;
    },
    handleUploads(file) {
      let imgData = new FormData();

      imgData.append("img", file.file);
      imgData.append("dirpath", this.$route.query.dirpath || "");
      this.isCompress ? imgData.append("quality", this.quality) : null;
      this.isCompress = true;
      upload(imgData).then((res) => {
        if (res.code === 200) {
          this.$message.success("上传成功！");
          this.fetchData();
        }
      });
    },
    qualityComfig(isCompress) {
      console.log(this.currFile);
      this.isCompress = isCompress;
      this.currFile.data.utype == "new"
        ? this.handleUploads(this.currFile)
        : this.replaceItem(this.currFile);
      this.dialogVisible = false;
    },
    replaceItem(file) {
      let imgData = new FormData();
      imgData.append("img", file.file);
      imgData.append("path", file.data.path);
      this.isCompress ? imgData.append("quality", this.quality) : null;
      this.isCompress = true;
      const _this = this;
      replaceFile(imgData).then((res) => {
        if (res.code === 200) {
          // this.listkey++
          const index = _this.allFileList.findIndex(
            (item) => item.path === file.data.path
          );

          _this.allFileList.splice(index, 1, {
            ...file.data,
            hash: new Date().getTime(),
            size: res.size,
          });
          _this.$message.success("更新成功！");
        }
      });
    },
    reviewVideo(url, ty) {
      this.videoUrl = url;
      this.show = true;
      this.ty = ty;
    },
    delItem(item) {
      const text =
        item.type === "dir"
          ? "确定要删除当前的文件夹及下面的文件吗"
          : "确定要删除当前的文件吗";
      this.$confirm(text, "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        delFile({ path: item.path }).then((res) => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.message });
            this.fetchData();
          }
        });
      });
    },

    handleAddDir() {
      this.$prompt("请输入文件夹名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^\s]+[\s]*.+$/,
        inputErrorMessage: "请填写文件夹名称",
      })
        .then(({ value }) => {
          addDir({
            dirpath: this.$route.query.dirpath || "",
            dirname: value,
          }).then((res) => {
            if (res.code === 200) {
              this.$message({ type: "success", message: "新建文件夹成功" });
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    clipboardSuccessHandler() {
      this.$message.success("复制成功");
    },
  },

  created() {
    const dirpath = this.$route.query.dirpath;
    console.log(dirpath);
    // if (dirpath) {
    //   this.path += dirpath + '/'
    // }
    this.fetchData();
    if (!dirpath) return;
    const pathArr = dirpath.split("/");
    pathArr.reduce((total, current) => {
      const path = `${total ? total + "/" : ""}${current}`;
      this.pathList.push({ name: current, path });
      return path;
    }, "");
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.top {
  display: flex;
  align-items: center;
  h2 {
    margin-right: 20px;
  }
  ::v-deep .el-upload-list {
    display: none;
  }
}
::v-deep .el-checkbox__label {
  display: none;
}

.file-list {
  list-style: none;
  li {
    font-size: 16px;
    line-height: 1.2;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.dir {
      background: rgb(236, 245, 255);
    }
    .right {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      flex: 1;
    }
    .center {
      font-size: 14px;
      color: #999;
    }
    .left {
      width: 300px;
      text-align: right;
    }
    i {
      font-size: 26px;
      color: #409eff;
    }
    .type {
      width: 100px;
      margin-left: 20px;
    }
  }
  .repalce {
    display: inline-block;
    position: relative;
    margin-left: 10px;
    ::v-deep .el-upload-list {
      display: none;
    }
    &-inpt {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
