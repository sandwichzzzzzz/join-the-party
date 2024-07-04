<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '用户管理', router: '/user-manag' }]" />
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
          <template #default="{ row }" v-if="item.prop === 'avatarUrl'">
            <el-image
              style="width: 70px; height: 70px; border-radius: 50%"
              :src="row.avatarUrl"
              fit="cover"
              :lazy="true"
            />
          </template>
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button
              type="primary"
              size="small"
              @click="handleDialogValue(row)"
              >查看</el-button
            >
            <el-button type="danger" size="small" @click="delUser(row)"
              >删除用户</el-button
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
import { options } from "./options";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";

const keyword = ref("");
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogTableValue = ref({});
const currentPage = ref(1);

onMounted(async () => {
  await initGetList();
});
async function initGetList(page = 1) {
  const res = await request.get("/getAllUser", { page });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
    findPage.value = false;
    currentPage.value = page;
  }
}
//查询功能
const findPage = ref(false);
async function getFindList(keywords, page = 1) {
  if (keywords == "") {
    initGetList(currentPage.value);
  } else {
    const res = await request.get("/findOneUser-limit", {
      keywords,
      page,
    });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      total.value = res.data.count;
      findPage.value = true;
    }
  }
}
//分页
const handleCurrentChange = (pageNum) => {
  if (findPage.value) {
    getFindList(keyword, pageNum);
  } else {
    initGetList(pageNum);
  }
  currentPage.value = pageNum;
};

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

//传值
const handleDialogValue = (row) => {
  dialogTitle.value = "用户信息";
  dialogTableValue.value = JSON.parse(JSON.stringify(row));
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
    const res = await request.get("/revokePermission", { _id: row._id });
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      initGetList();
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
}
.header > * {
  margin-right: 10px;
}
.el-pagination {
  text-align: left;
  margin-top: 15px;
}
</style>
  