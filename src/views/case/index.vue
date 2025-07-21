<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/case/edit')"
      >新增</el-button
    >
    <el-divider />
    <SearchHeader ref="searchRef" :config="config" @onSubmit="onSearch" />
    <el-divider />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="_id" align="center" prop="_id" />
      <el-table-column label="分类" align="center" prop="brand_id">
        <template slot-scope="scope">
          {{ scope.row.brand_id && scope.row.brand_id.name }}
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" prop="classfiy_id">
        <template slot-scope="scope">
          {{ scope.row.classfiy_id && scope.row.classfiy_id.name }}
        </template>
      </el-table-column>

      <el-table-column label="名称" align="center" prop="name" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="是否开启" align="center" prop="open">
        <template slot-scope="scope">
            <el-switch v-model="scope.row.open" @change="handleChange(scope.row)" />
          </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="image">
        <!-- <el-table-column label="视频" align="center" prop="video"> -->
        <template slot-scope="scope">
          <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" alt="" style="width: 40px" />
        </template>
      </el-table-column>
      <el-table-column label="视频" align="center" prop="video">
        <template slot-scope="scope">
          <video :src="scope.row.video" @click="reviewVideo(scope.row.video)" alt="" style="width: 40px" />
        </template>
      </el-table-column>

      <!-- <el-table-column label="puid" align="center" prop="puids" type="expand">
        <template slot-scope="scope">
          <div style="display: flex; flex-wrap: wrap; gap: 10px">
            <p
              v-for="item in scope.row.puids"
              :key="item._id"
              style="width: calc(10% - 10px); padding: 5px; text-align: center"
            >
              {{ item.puid }}: {{ item.requestCount }}
            </p>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createAt">
        <template slot-scope="scope">
          {{ new Date(scope.row.createAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateAt">
        <template slot-scope="scope">
          {{ new Date(scope.row.updateAt).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column label="创建人" align="center" prop="createdBy">
        <template slot-scope="scope">
          {{ scope.row.createdBy ? scope.row.createdBy.username : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updatedBy">
        <template slot-scope="scope">
          {{ scope.row.updatedBy ? scope.row.updatedBy.username : "--" }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/case/edit?id=${scope.row._id}&dirpath=case`)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="delItem(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column></el-table
    >

    <el-pagination
      style="text-align: right; margin-top: 20px"
      layout="prev, pager, next"
      :total="queryParams.total"
      :current-page.sync="queryParams.page"
      @current-change="pageChange"
    />

    <Videoshow :url="videoUrl" :show.sync="show" />
  </div>
</template>

<script>
import {
  getProductList,
  delProduct,
  getClassfiyList,
  getBrandList,
  addProduct,
  getPuids,
} from "@/api/product";
import Videoshow from "@/components/Videoshow";
export default {
  components: { Videoshow },
  data() {
    return {
      show: false,
      videoUrl: "",
      list: null,
      listLoading: true,
      dialogVisible: false,
      queryParams: {},
      brand_list: [],
      config: [
        {
          type: "select",
          label: "分类",
          key: "brand_id",
          options: {},
        },
        { type: "select", label: "类别", key: "classfiy_id", options: {} },
        // { type: "select", label: "puid", key: "puid", options: {} },
        { type: "input", label: "模板类别名称", key: "name" },
      ],
    };
  },
  mounted() {
    this.$watch(
      () => this.$refs.searchRef.form.brand_id,
      (val) => {
        console.log(this.$refs.searchRef.form);
        this.brandChange(val);
      }
    );
  },
  created() {
    this.fetchData();
    getBrandList().then((res) => {
      const list = {};
      res.data.list.forEach((el) => {
        list[el._id] = el.name;
      });
      this.$set(this.config[0], "options", list);
    });
    getClassfiyList({ brand_id: this.queryParams.brand_id, size: 1000 }).then(
      (res) => {
        const list = {};
        this.brand_list = res.data.list;
        res.data.list.forEach((el) => {
          list[el._id] = el.name;
        });
        this.$set(this.config[1], "options", list);
      }
    );
    getPuids().then((res) => {
      const list = {};
      res.data.forEach((el) => {
        list[el._id] = el.puid;
      });
      this.$set(this.config[2], "options", list);
    });
  },
  methods: {
    fetchData(queryParams = {}) {
      this.listLoading = true;
      getProductList({ ...this.queryParams, ...queryParams }).then((res) => {
        this.list = res.data.list;
        this.queryParams = {
          page: res.data.page,
          total: res.data.total,
          ...queryParams,
        };
        this.listLoading = false;
      });
    },
    brandChange(val) {
      const showl = {};
      const list = this.brand_list.filter((item) => {
        console.log(item);
        return item.brand_id._id === val;
      });
      list.forEach((el) => {
        showl[el._id] = el.name;
      });
      this.$refs.searchRef.form.classfiy_id = null;
      this.$set(this.config[1], "options", showl);
    },
    delItem(id) {
      this.$confirm("确定要删除当前的数据吗", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        delProduct({ id }).then((res) => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.message });
            this.fetchData();
          }
        });
      });
    },
    submitAdd() {},
    onSearch(form) {
      this.fetchData(form);
    },
    pageChange() {
      this.fetchData();
    },
    handleChange(item) {
      addProduct({ _id: item._id, open: item.open }).then((res) => {
        if (res.code === 200) {
          this.$message({ type: "success", message: "修改成功" });
          this.fetchData();
        }
      });
    },
    reviewVideo(url) {
      this.videoUrl = url;
      this.show = true;
    },
  },
};
</script>
