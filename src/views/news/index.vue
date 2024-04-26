<template>
  <div class="app-container">
    <el-button @click="$router.push('/news/edit')" type="success"
      >新增</el-button
    >
    <el-divider></el-divider>
    <SearchHeader :config="config" @onSubmit="onSearch" />
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
      <el-table-column align="center" label="新闻标题" width="270" prop="title">
      </el-table-column>

      <el-table-column label="新闻描述" align="center" prop="desc">
      </el-table-column>

      <el-table-column label="新闻时间" prop="time" width="110">
      </el-table-column>
      <el-table-column label="封面图" width="130" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.cover"
            fit="cover"
            :preview-src-list="[scope.row.cover]"
            alt=""
            width="90px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            @click="$router.push(`/news/edit?id=${scope.row._id}`)"
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
import { getnewList, delNew } from "@/api/user";

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
      getnewList({ ...this.queryParams, ...queryParams }).then((res) => {
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
        delNew({ id }).then((res) => {
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
