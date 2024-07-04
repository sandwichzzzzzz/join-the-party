<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '资讯管理', router: '/information-manag' }]" />
    <div class="content-main">
      <el-row :gutter="30" class="header">
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
        <el-dropdown>
          <el-button type="primary"
            >添加咨询<el-icon class="el-icon--right"><arrow-down /></el-icon
          ></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDialogValue('vdieo')"
                >添加视频咨询</el-dropdown-item
              >
              <el-dropdown-item @click="handleDialogValue('image')"
                >添加图片咨询</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
          :width="item.width"
          show-overflow-tooltip
          align="center"
          :sortable="item.sortable"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in options"
          :key="index"
        >
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button
              type="primary"
              size="small"
              @click="handleDialogValue(row.fileType, row)"
              >修改</el-button
            >
            <el-button type="danger" size="small" @click="delUser(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
        @initUserList="initGetUsersList"
        :dialogTableValue="dialogTableValue"
        :dialogIsIamg="dialogIsIamg"
      />
    </div>
  </div>
</template>
  
<script setup name="users">
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import request from "@/api/request.js";
import { ArrowDown } from "@element-plus/icons-vue";
import { options } from "./options";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";

const keyword = ref("");
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogIsIamg = ref(false);
const dialogTableValue = ref({});
const currentPage = ref(1);

onMounted(async () => {
  await initGetUsersList();
});
async function initGetUsersList(page = 1) {
  const res = await request.get("/allNew-pc", { page });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
  }
}
async function getFindList(keywords, page = 1) {
  if (keywords == "") {
    initGetUsersList(page);
  } else {
    const res = await request.get("/findNews", { keywords, page });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      total.value = res.data.count;
    }
  }
}

//分页
const handleCurrentChange = (pageNum) => {
  currentPage.value = pageNum;
  getFindList(keyword.value, pageNum);
};

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

//弹窗
const handleDialogValue = (type, row) => {
  if (type == "image") {
    dialogIsIamg.value = true;
  } else {
    dialogIsIamg.value = false;
  }
  if (isNull(row)) {
    dialogTitle.value = "添加咨询";
    dialogTableValue.value = {};
  } else {
    dialogTitle.value = "编辑资讯";
    dialogTableValue.value = JSON.parse(JSON.stringify(row));
  }
  dialogVisible.value = true;
};

//删除
async function delUser(row) {
  try {
    await ElMessageBox.confirm("确定删除吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await request.get("/deleteNew", { _id: row._id });
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      getFindList(keyword.value, currentPage.value);
    } else {
      ElMessage({
        type: "warning",
        message: "删除失败: " + res.msg,
      });
    }
  } catch (error) {
    // 用户取消操作或API请求失败
    if (error == "cancel") {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    } else {
      console.error("删除活动时发生错误:", error);
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
  padding-left: 2%;
}
.header > * {
  margin-right: 20px;
}
.el-pagination {
  text-align: left;
  margin-top: 15px;
}
</style>
  