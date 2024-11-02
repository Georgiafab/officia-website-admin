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
      <el-table-column label="_id" width="100" align="center" prop="_id" />
      <el-table-column label="分类" align="center" prop="brand_id">
        <template slot-scope="scope">
          {{ scope.row.brand_id ? scope.row.brand_id.name : "--" }}
        </template>
      </el-table-column>

      <el-table-column label="产品类别" align="center" prop="name" />
      <el-table-column label="权重" align="center" prop="sort" />
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
import { getClassfiyList, delClassfiy, getBrandList } from "@/api/product";

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
        { type: "select", label: "分类", key: "brand_id", options: {} },
        { type: "input", label: "类别名称", key: "name" },
      ],
    };
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
  },
  methods: {
    fetchData(queryParams = {}) {
      this.listLoading = true;
      console.log(queryParams.brand_id);
      getClassfiyList({ ...this.queryParams, ...queryParams }).then((res) => {
        console.log(queryParams.brand_id, "111");
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
