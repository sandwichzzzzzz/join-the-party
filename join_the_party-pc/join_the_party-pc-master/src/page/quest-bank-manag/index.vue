<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '题库管理', router: '/quest-bank-manag' }]" />
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
        <el-button @click="handleDialogValue()" type="primary"
          >添加题目</el-button
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
              type="primary"
              size="small"
              @click="handleDialogValue(row)"
              >修改</el-button
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
        @current-change="handleCurrentChange"
        style="padding-left: 30%"
      />
      <Dialog
        v-model="dialogVisible"
        :dialogTitle="dialogTitle"
        v-if="dialogVisible"
        @initUserList="initGetUsersList"
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
let currentPage = 1;

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
onMounted(async () => {
  await initGetUsersList();
});

//转换题型
const changeType = (item) => {
  // 判断 type 属性的值，进行相应的转换
  if (item === "101") {
    item = "单选题";
  } else if (item === "102") {
    item = "多选题";
  }
  // 返回转换后的对象
  return item;
};
const changeTyped = (item) => {
  item = item.replace(/单选题/g, "101");
  item = item.replace(/多选题/g, "102");
  return item;
};

//获取题库数据
async function initGetUsersList(page = 1) {
  const res = await request.get("/allQuestion", { page });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
    console.log("isNull(res):", isNull(res));
    console.log("res:", res);
  } else {
    console.log("isNull(res):", isNull(res));
    console.log("res:", res);
    tableData.value = res.data.data;
    //将单选题转化为101，将多选题转化...
    tableData.value = tableData.value.map((item) => {
      return { ...item, type: changeType(item.type) };
    });
    console.log("tableData:", tableData);
    total.value = res.data.count;
  }
}

//查询功能
const findPage = ref(false);
async function getFindList(keywords, page = 1) {
  if (keywords == "") {
    initGetUsersList(currentPage);
  } else {
    keywords = changeTyped(keywords);
    console.log("find", { keywords, page });
    const res = await request.get("/findQuestion", { keywords, page });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      console.log("res:", res);
      tableData.value = res.data.data;
      //将单选题转化为101，将多选题转化...
      tableData.value = tableData.value.map((item) => {
        return { ...item, type: changeType(item.type) };
      });
      console.log("tableData:", tableData);
      total.value = res.data.count;
      findPage.value = true;
    }
  }
}
//分页
const handleCurrentChange = (pageNum) => {
  if (findPage.value) {
    getFindList(keyword.value, pageNum);
  } else {
    initGetUsersList(pageNum);
  }
  currentPage = pageNum;
};

//传值
const handleDialogValue = (row) => {
  console.log(row);
  console.log("触发dialogTableValue");
  if (isNull(row)) {
    dialogTitle.value = "添加题目";
    dialogTableValue.value = {};
  } else {
    dialogTitle.value = "编辑题目";
    console.log("dialogTableValue:", dialogTableValue);
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
    const res = await request.get("/deleteQuestion", { _id: row._id });

    // 根据服务器响应结果处理反馈信息
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      getFindList(keyword.value);
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
  margin-right: 20px;
}
.el-pagination {
  text-align: left;
  margin-top: 15px;
}
</style>
  