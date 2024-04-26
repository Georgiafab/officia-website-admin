<template>
  <div class="app-container">
    <el-button @click="$router.push('/brand/edit')" type="success"
      >新增</el-button
    >
    <el-divider></el-divider>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="url 标题"
        width="100"
        prop="enTitle"
        align="center"
      >
      </el-table-column>

      <el-table-column align="center" label="排序" width="270" prop="sort_num">
      </el-table-column>

      <el-table-column label="品牌名" align="center" prop="brand_name">
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            @click="$router.push(`/brand/edit?id=${scope.row._id}`)"
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
      :current-page.sync="queryParams.page"
      @current-change="pageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { delBrand, getBrandList } from "@/api/product";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      queryParams: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getBrandList(this.queryParams).then((res) => {
        this.list = res.data.list;
        this.queryParams = {
          page: res.data.page,
          total: res.data.total,
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
        delBrand({ id }).then((res) => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.message });
            this.fetchData();
          }
        });
      });
    },
    submitAdd() {},
    pageChange() {
      this.fetchData();
    },
  },
};
</script>
