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
      <el-table-column label="案例类别" align="center" prop="classfiy_id">
        <template slot-scope="scope">
          {{ scope.row.classfiy_id && scope.row.classfiy_id.classfiy_name }}
        </template>
      </el-table-column>

      <el-table-column label="案例名称" align="center" prop="product_name" />
      <el-table-column label="案例副标题" align="center" prop="case_subname" />
      <el-table-column label="案例封面图" align="center" prop="product_image">
        <template slot-scope="scope">
          <img :src="scope.row.product_image" alt="" width="90px" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/product/edit?id=${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="delItem(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: right; margin-top: 20px"
      layout="prev, pager, next"
      :total="queryParams.total"
      :current-page.sync="queryParams.page"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { getProductList, delProduct, getClassfiyList } from "@/api/product";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      queryParams: {},
      brand_list: [],
      config: [
        { type: "select", label: "类别", key: "classfiy_id", options: {} },
        { type: "input", label: "案例名称", key: "case_name" },
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
    getClassfiyList({ size: 1000 }).then((res) => {
      const list = {};
      this.brand_list = res.data.list;
      res.data.list.forEach((el) => {
        list[el._id] = el.classfiy_name;
      });
      this.$set(this.config[0], "options", list);
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
