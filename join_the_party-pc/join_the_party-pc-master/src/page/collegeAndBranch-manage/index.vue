<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '学院管理', router: '/collegeAndBranch' }]" />
    <div class="content-main">
      <el-row :gutter="20" class="header" style="padding-left: 50px">
        <el-button type="primary" @click="handleDialogValue()"
          >添加学院</el-button
        >
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
          :width="item.width"
          show-overflow-tooltip
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in options"
          :key="index"
        >
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button
              type="success"
              size="small"
              @click="handleDialogValue(row)"
              >添加党支部</el-button
            >
            <el-button type="primary" size="small" @click="jump(row)"
              >查看</el-button
            >
            <el-button type="danger" size="small" @click="delUser(row)"
              >删除</el-button
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
        @initUserList="initGetList"
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
import { options } from "./options";
import { optionsAdmin } from "./optionsAdmin";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";
import { useRouter } from "vue-router";

const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogTableValue = ref({});
const dialogType = ref();
const currentPage = ref(1);

const $router = useRouter(); // 这是路由跳转的

onMounted(async () => {
  await initGetList();
});
async function initGetList(page = 1) {
  const res = await request.get("/getAllCollege", { page });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
  }
}

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

const handleDialogValue = (row) => {
  if (isNull(row)) {
    dialogTitle.value = "添加学院";
    dialogType.value = "";
  }
  {
    dialogTitle.value = "添加党支部";
    dialogType.value = row.type;
  }
  dialogTableValue.value = {};
  dialogVisible.value = true;
};

//跳转
function jump(row) {
  localStorage.setItem("College-type", JSON.stringify(row.type));
  $router.push("/Branch-manag");
}

//分页
const currentChange = (pageNum) => {
  currentPage.value = pageNum;
  initGetList(pageNum);
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
    res = await request.get("/deleteCollege", { _id: row._id });

    // 处理响应结果
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      // 调用列表更新函数，这里假设 getFindList 是一个已定义的函数
      initGetList(currentPage.value);
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
    