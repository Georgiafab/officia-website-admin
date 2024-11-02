<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/users/edit')"
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
      <el-table-column label="_id" prop="_id" align="center" />
      <el-table-column label="用户名" prop="username" align="center" />
      <!-- <el-table-column align="center" label="电话" prop="phone" /> -->

      <!-- <el-table-column label="邮箱" align="center" prop="email" /> -->

      <!-- <el-table-column label="qrcodeImg" width="130" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.qrcodeImg"
            fit="cover"
            :preview-src-list="[scope.row.qrcodeImg]"
            alt=""
            width="60px"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/users/edit?id=${scope.row._id}`)"
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
import { getUserslist, delUser } from "@/api/user";

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
      config: [{ type: "input", label: "搜索用户名", key: "keyward" }],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(queryParams = {}) {
      this.listLoading = true;
      getUserslist({ ...this.queryParams, ...queryParams }).then((res) => {
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
        delUser({ id }).then((res) => {
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
