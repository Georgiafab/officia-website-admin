<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/classfiy/edit')"
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
      <!-- <el-table-column align="center" label="类别ID" prop="_id">
      </el-table-column> -->

      <!-- <el-table-column align="center" label="排序" width="270" prop="sort_num">
      </el-table-column> -->
      <el-table-column
        label="url 标题"
        width="100"
        align="center"
        prop="enTitle"
      />

      <el-table-column label="案例类别" align="center" prop="classfiy_name" />

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/classfiy/edit?id=${scope.row._id}`)"
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
import { getClassfiyList, delClassfiy } from "@/api/product";

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
      config: [
        // { type: "select", label: "品牌", key: "brand_id", options: {} },
        { type: "input", label: "类别名称", key: "classfiy_name" },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(queryParams = {}) {
      this.listLoading = true;
      getClassfiyList({ ...this.queryParams, ...queryParams }).then((res) => {
        this.list = res.data.list;
        this.listLoading = false;
        this.queryParams = {
          page: res.data.page,
          total: res.data.total,
          ...queryParams,
        };
      });
    },
    delItem(id) {
      this.$confirm("确定要删除当前的数据吗", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        delClassfiy({ id }).then((res) => {
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
