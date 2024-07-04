<template>
  <div id="Content-page">
    <Paging
      :pagData="[
        { name: '学院党支部管理', router: '/collegeAndBranch' },
        { name: '党支部管理', router: '/Branch-manag' },
      ]"
    />
    <div class="content-main">
      <el-table :data="tableData" stripe>
        <el-table-column
          :width="item.width"
          show-overflow-tooltip
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in optionsAdmin"
          :key="index"
        >
          <template #default="{ row }" v-if="item.prop === 'image'">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.image"
              fit="fill"
            />
          </template>
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button type="danger" size="small" @click="delUser(row)"
              >删除党支部</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        style="padding-left: 40%"
      />
      <Dialog
        v-model="dialogVisible"
        :dialogTitle="dialogTitle"
        v-if="dialogVisible"
        @initAdminsList="initGetAdminsList"
        :dialogTableValue="dialogTableValue"
        :dialogType="dialogType"
      />
    </div>
  </div>
</template>
      
  <script setup name="users">
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import request from "@/api/request.js";
import { optionsAdmin } from "./optionsAdmin";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";

const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogTableValue = ref({});
const dialogType = ref();
const currentPage = ref(1);

onMounted(async () => {
  await initGetAdminsList();
});
async function initGetList(path, page = 1) {
  const College_type = JSON.parse(localStorage.getItem("College-type"));

  const res = await request.get(path, { page, type: College_type });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
  }
}

//获取管理员数据
async function initGetAdminsList(page) {
  await initGetList("/getAllBranch", page, false);
}

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

//分页
const currentChange = (pageNum) => {
  currentPage = pageNum;

  initGetAdminsList(pageNum);
};

//删除
async function delUser(row) {
  try {
    // 弹出确认对话框
    await ElMessageBox.confirm("确定解除权限吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 根据用户的表格选择调用不同的API
    let res;

    res = await request.get("/deleteBranch", { _id: row._id });

    // 处理响应结果
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      // 调用列表更新函数，这里假设 getFindList 是一个已定义的函数
      initGetAdminsList();
    } else {
      ElMessage({
        type: "warning",
        message: "删除失败: " + res.msg,
      });
    }
  } catch (error) {
    // 用户取消操作或API请求出现异常
    if (error === "cancel") {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    } else {
      console.error("删除时发生错误:", error);
      ElMessage({
        type: "error",
        message: "操作失败，请稍后重试",
      });
    }
  }
}
</script>
      
      <style lang="scss">
.header {
  padding-bottom: 20px;

  // padding-left: 2%;
}
.header > * {
  margin-left: 10px;
}
.el-pagination {
  text-align: left;
  margin-top: 15px;
}
</style>
      