<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/files/edit')"
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
      <el-table-column label="_id" width="100" align="center" prop="_id" />

      <el-table-column label="配置类型" align="center" prop="type" />
      <el-table-column label="值" align="center" prop="key" />
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column label="文件路径" align="center" prop="filepath" />
      <el-table-column label="产品" align="center" prop="product">
        <template slot-scope="scope">
          {{ scope.row.product ? scope.row.product.name : "--" }}
        </template>
      </el-table-column>
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

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/files/edit?id=${scope.row._id}`)"
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
import { delFilePro, getFilesPro } from "@/api/user";

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
      config: [{ type: "input", label: "搜索内容", key: "keyward" }],
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    onSearch(form) {
      this.fetchData(form);
    },
    fetchData(form) {
      this.listLoading = true;
      getFilesPro({ ...this.queryParams, ...form }).then((res) => {
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
        delFilePro({ id }).then((res) => {
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
