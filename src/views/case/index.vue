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
          {{
            scope.row.classfiy_id1 && scope.row.classfiy_id1.classfiy_name + ","
          }}
          {{ scope.row.classfiy_id2 && scope.row.classfiy_id2.classfiy_name }}
        </template>
      </el-table-column>

      <el-table-column label="案例名称" align="center" prop="case_name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="是否展示在首页" align="center" prop="isHome">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isHome"
            @change="handleChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="案例副标题" align="center" prop="case_subname" />
      <el-table-column label="案例封面图" align="center" prop="case_image">
        <template slot-scope="scope">
          <img :src="scope.row.case_image" alt="" width="90px" />
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
import {
  getProductList,
  delProduct,
  getClassfiyList,
  getBrandList,
  addProduct,
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
          label: "分类",
          key: "brand_id",
          options: {},
        },
        { type: "select", label: "类别", key: "classfiy_id", options: {} },
        { type: "input", label: "puid", key: "puid" },
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
      addProduct({ _id: item._id, isHome: item.isHome }).then((res) => {
        if (res.code === 200) {
          this.$message({ type: "success", message: "修改成功" });
        }
      });
    },
  },
};
</script>
