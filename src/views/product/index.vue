<template>
  <div class="app-container">
    <el-button @click="$router.push('/product/edit')" type="success"
      >新增</el-button
    >
    <el-divider></el-divider>
    <SearchHeader :config="config" @onSubmit="onSearch" ref="searchRef" />
    <el-divider></el-divider>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="品牌名" align="center" prop="brand_id">
        <template slot-scope="scope">
          {{ scope.row.brand_id ? scope.row.brand_id.brand_name : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="产品类别" align="center" prop="classfiy_id">
        <template slot-scope="scope">
          {{ scope.row.classfiy_id && scope.row.classfiy_id.classfiy_name }}
        </template>
      </el-table-column>

      <el-table-column label="产品名称" align="center" prop="product_name">
      </el-table-column>

      <el-table-column label="产品图片" align="center" prop="product_image">
        <template slot-scope="scope">
          <img :src="scope.row.product_image" alt="" width="90px" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            @click="$router.push(`/product/edit?id=${scope.row._id}`)"
            size="small"
            >编辑</el-button
          >
          <el-button type="danger" @click="delItem(scope.row._id)" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: right; margin-top: 20px"
      layout="prev, pager, next"
      :total="queryParams.total"
      @current-change="pageChange"
      :current-page.sync="queryParams.page"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  getProductList,
  delProduct,
  getBrandList,
  getClassfiyList,
} from "@/api/product";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      queryParams: {},
      brand_list: [],
      config: [
        {
          type: "select",
          label: "品牌",
          key: "brand_id",
          options: {},
        },
        { type: "select", label: "类别", key: "classfiy_id", options: {} },
        { type: "input", label: "产品名称", key: "product_name" },
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
        list[el._id] = el.brand_name;
      });
      this.$set(this.config[0], "options", list);
    });
    getClassfiyList({ brand_id: this.queryParams.brand_id, size: 1000 }).then(
      (res) => {
        const list = {};
        this.brand_list = res.data.list;
        res.data.list.forEach((el) => {
          list[el._id] = el.classfiy_name;
        });
        this.$set(this.config[1], "options", list);
      }
    );
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
        return item.brand_id._id == val;
      });
      list.forEach((el) => {
        showl[el._id] = el.classfiy_name;
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
  },
};
</script>
