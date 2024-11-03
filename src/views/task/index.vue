<template>
  <div class="app-container">
    <el-button type="success" @click="$router.push('/banner/edit')"
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
      <el-table-column align="center" label="ID" prop="_id" />
      <el-table-column align="center" label="用户设备号" prop="device" />
      <el-table-column align="center" label="使用模型" prop="classfiy_id" />
      <el-table-column align="center" label="场景类型" prop="case_id" />
      <el-table-column align="center" label="任务情况" prop="task_situation" />
      <el-table-column label="原图" align="center" prop="original_img">
        <!-- <el-table-column label="视频" align="center" prop="video"> -->
        <template slot-scope="scope">
          <el-image :src="scope.row.original_img" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="结果视频" prop="result_video">
        <template slot-scope="scope">
          <video :src="scope.row.result_video" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="失败原因" prop="fail_reason" />
      <el-table-column label="状态" align="center" prop="status">
        <!-- <el-table-column label="视频" align="center" prop="video"> -->
        <template slot-scope="scope">
          {{ statusFilter(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createAt">
        <template slot-scope="scope">
          {{ new Date(scope.row.createAt).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="$router.push(`/banner/edit?id=${scope.row._id}`)"
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
import { delTasks, getTasks } from "@/api/user";
import { getClassfiyList, getBrandList, getProductList } from "@/api/product";
const statusMap = ["生成失败", "生成成功", "生成中"];
export default {
  filters: {
    statusFilter(status) {
      // const statusMap = ["生成失败", "生成成功", "生成中"];
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      brand_list: [],
      classfiy_list: [],
      queryParams: {},
      config: [
        {
          type: "select",
          label: "分类",
          key: "brand_id",
          options: {},
        },
        { type: "select", label: "模板", key: "classfiy_id", options: {} },
        { type: "select", label: "类别", key: "case_id", options: {} },
        { type: "input", label: "搜索内容", key: "keyward" },
      ],
    };
  },
  mounted() {
    this.$watch(
      () => this.$refs.searchRef.form.brand_id,
      (val) => {
        console.log(this.$refs.searchRef.form);
        console.log("val", val);
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
    this.getClassfiy();
  },
  methods: {
    fetchData(form) {
      this.listLoading = true;
      getTasks({ ...this.queryParams, ...form }).then((res) => {
        this.list = res.data.list;
        this.queryParams = {
          page: res.data.page,
          total: res.data.total,
        };
        this.listLoading = false;
      });
    },
    onSearch(form) {
      this.fetchData(form);
    },
    getClassfiy() {
      getClassfiyList({
        brand_id: this.$refs?.searchRef?.form?.brand_id,
        size: 1000,
      }).then((res) => {
        const list = {};
        this.brand_list = res.data.list;

        res.data.list.forEach((el) => {
          list[el._id] = el.name;
        });
        this.$set(this.config[1], "options", list);
        this.getCase();
      });
    },
    getCase() {
      getProductList({
        brand_id: this.$refs?.searchRef?.form?.brand_id,
        classfiy_id: this.$refs?.searchRef?.form?.classfiy_id,
        size: 1000,
      }).then((res) => {
        const list = {};
        this.classfiy_list = res.data.list;
        res.data.list.forEach((el) => {
          list[el._id] = el.name;
        });
        this.$set(this.config[2], "options", list);
      });
    },
    brandChange(val) {
      // console.log(val, "valval");
      // const showl = {};
      // const list = this.brand_list.filter((item) => {
      //   console.log(item);
      //   return item.brand_id._id === val;
      // });
      // list.forEach((el) => {
      //   showl[el._id] = el.name;
      // });
      this.$refs.searchRef.form.classfiy_id = null;
      this.$refs.searchRef.form.case_id = null;
      // this.$set(this.config[1], "options", showl);
      this.getClassfiy();
    },
    classifyChange(val) {
      // const showl = {};
      // const list = this.classfiy_list.filter((item) => {
      //   console.log(item);
      //   return item.classfiy_id._id === val;
      // });
      // list.forEach((el) => {
      //   showl[el._id] = el.name;
      // });
      this.$refs.searchRef.form.case_id = null;
      // this.$set(this.config[2], "options", showl);
      this.getCase();
    },
    delItem(id) {
      this.$confirm("确定要删除当前的数据吗", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        delTasks({ id }).then((res) => {
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
