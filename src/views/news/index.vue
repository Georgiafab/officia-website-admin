<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/product/edit')"
      >新增</el-button
    >
    <el-divider />
    <SearchHeader :config="config" @onSubmit="onSearch" />
    <el-divider />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="270" prop="_id" />
      <el-table-column align="center" label="产品名" width="270" prop="name" />
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
import { getProList, delPro } from "@/api/product";

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
      queryParams: {},
      config: [{ type: "input", label: "搜索内容", key: "keyward" }],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(queryParams = {}) {
      this.listLoading = true;
      getProList({ ...this.queryParams, ...queryParams }).then((res) => {
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
        delPro({ id }).then((res) => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.message });
            this.fetchData();
          }
        });
      });
    },
    onSearch(form) {
      this.fetchData(form);
    },
    pageChange() {
      this.fetchData();
    },
  },
};
</script>
