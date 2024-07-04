<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '权限管理', router: '/jurisdic-manag' }]" />
    <div class="content-main">
      <el-row :gutter="20" class="header">
        <el-col :span="7">
          <el-input
            @keyup.enter="getFindList(keyword)"
            placeholder="输入查询内容"
            v-model="keyword"
            clearable
          />
        </el-col>
        <el-button type="primary" :icon="Search" @click="getFindList(keyword)"
          >查询</el-button
        >
        <el-button-group>
          <el-button
            type="primary"
            :disabled="changeTable"
            @click="(changeTable = true), getFindList(keyword)"
            >学生信息</el-button
          >
          <el-button
            type="primary"
            :disabled="!changeTable"
            @click="(changeTable = false), getFindList(keyword)"
            >管理员信息</el-button
          >
        </el-button-group>
        <el-button type="primary" @click="handleDialogValue()"
          >添加管理员</el-button
        >
        <!-- 导入excel -->
        <el-upload
          action=""
          :before-upload="getFile"
          :http-request="fileUpload"
          accept=".xlsx, .xls"
          :show-file-list="false"
        >
          <el-button type="primary" class="imExcelBtn">导入Excel</el-button>
        </el-upload>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-if="!changeTable"
      >
        <el-table-column
          :width="item.width"
          show-overflow-tooltip
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in optionsAdmin"
          :key="index"
        >
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button type="danger" size="small" @click="delUser(row)"
              >解除权限</el-button
            >
          </template>
          <!-- <template v-slot="{ row }" v-else-if="item.prop === 'create_time'">
          {{ $filters.filterTimes(row.create_time) }}
        </template> -->
        </el-table-column>
      </el-table>
      <el-table :data="tableData" stripe style="width: 100%" v-if="changeTable">
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
            <el-button type="danger" size="small" @click="delUser(row)"
              >解除权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        style="padding-left: 30%"
      />

      <Dialog
        v-model="dialogVisible"
        :dialogTitle="dialogTitle"
        v-if="dialogVisible"
        @initUserList="initGetAdminsList"
        :dialogTableValue="dialogTableValue"
      />
    </div>
  </div>
</template>
  
<script setup name="users">
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import request from "@/api/request.js";
import { fileUrl } from "@/api/request.js";
import { options } from "./options";
import { optionsAdmin } from "./optionsAdmin";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";

const keyword = ref("");
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogTableValue = ref({});
let currentPage = 1;
const changeTable = ref(true);

onMounted(async () => {
  await initGetUsersList();
});
async function initGetList(path, page = 1, isChangeTable = false) {
  const res = await request.get(path, { page });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
    changeTable.value = isChangeTable;
    findPage.value = false;
    currentPage = page;
  }
}

// 获取学生数据
async function initGetUsersList(page = 1) {
  await initGetList("/getAllStudent", page, true);
}
//获取管理员数据
async function initGetAdminsList(page = 1) {
  await initGetList("/getAllAdmin", page, false);
}

const findPage = ref(false);
async function getFindList(keyword, page = 1) {
  let res;
  if (keyword == "") {
    if (changeTable.value) {
      initGetUsersList(page);
    } else {
      initGetAdminsList(page);
    }
  } else {
    if (changeTable.value == true) {
      res = await request.get("/findOneStudent-limit", {
        keyword,
        page,
      });
    } else {
      res = await request.get("/findOneAdmin-limit", {
        keyword,
        page,
      });
    }
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      total.value = res.data.count;
      findPage.value = true;
    }
  }
}

const File = ref();
const getFile = (param) => {
  File.value = param;
};

const fileUpload = async () => {
  const formData = new FormData();
  formData.append("studentdataFile", File.value);
  const res = await request.post("/import-student-data", formData);
  getFindList(keyword.value);
  // 根据服务器响应结果处理反馈信息
  if (res.msg === "SUCCESS") {
    ElMessage({
      type: "success",
      message: "导入成功！",
    });
    getFindList(keyword.value);
  } else {
    ElMessage({
      type: "warning",
      message: "导入失败: " + res.msg,
    });
  }
};

//分页
const handleCurrentChange = (pageNum) => {
  getFindList(keyword.value, pageNum);

  currentPage = pageNum;
};

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

const handleDialogValue = (row) => {
  dialogTitle.value = "添加管理员";
  dialogTableValue.value = {};

  dialogVisible.value = true;
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
    if (changeTable.value) {
      res = await request.get("/delStudent", { _id: row._id });
    } else {
      res = await request.get("/delAdmin", { _id: row._id });
    }

    // 处理响应结果
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "解除成功！",
      });
      // 调用列表更新函数，这里假设 getFindList 是一个已定义的函数
      getFindList(keyword.value, currentPage);
    } else {
      ElMessage({
        type: "warning",
        message: "解除失败: " + res.msg,
      });
    }
  } catch (error) {
    // 用户取消操作或API请求出现异常
    if (error === "cancel") {
      ElMessage({
        type: "info",
        message: "解除取消",
      });
    } else {
      console.error("解除权限时发生错误:", error);
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
}
.header > * {
  margin-right: 10px;
}
.el-pagination {
  text-align: left;
  margin-top: 15px;
}
</style>
  