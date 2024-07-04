<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '学生信息管理', router: '/stuInfor-manag' }]" />
    <div class="content-main">
      <el-row :gutter="30" class="header">
        <el-col :span="7">
          <el-input
            @keyup.enter="getFindList(findKeyword)"
            placeholder="输入查询内容"
            v-model="findKeyword"
            clearable
          />
        </el-col>
        <el-button
          type="primary"
          :icon="Search"
          @click="getFindList(findKeyword)"
          >查询</el-button
        >
        <el-text class="mx-1" type="primary" size="large">学院:</el-text>
        <!-- 选择器 -->
        <el-select
          v-model="currentcollege"
          placeholder="请选择学院"
          class="m-2"
          size="large"
          style="width: 20%"
        >
          <el-option
            v-for="item in colleges"
            :key="item"
            :label="item.college"
            :value="item.college"
            @click="getFindList(findKeyword)"
          />
        </el-select>
        <!-- 导出为Excel -->
        <el-button type="primary" @click="exportExcel()">导出为Excel</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
          :width="item.width"
          :sortable="item.sortable"
          show-overflow-tooltip
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in options"
          :key="index"
        >
          <template #default="{ row }" v-if="item.prop === 'status'">
            <el-select
              v-model="row.status"
              class="m-2"
              size="default"
              @change="changeStatus(row)"
            >
              <el-option
                v-for="item in statuses"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
          <template #default="{ row }" v-if="item.prop === 'action'">
            <el-button
              type="primary"
              size="small"
              @click="handleDialogValue(row)"
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
        style="padding-left: 25%"
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
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import request from "@/api/request.js";
import { options } from "./options";
import { stu_title } from "./stulnfor-title";
import { ElMessage, ElMessageBox } from "element-plus";
import Dialog from "./components/dialog.vue";

const findKeyword = ref("");
const tableData = ref([]);
const baseTableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogTableValue = ref({});
let currentPage = 1;
const statuses = ref([
  "共青团员",
  "入党积极分子",
  "发展对象",
  "预备党员",
  "中共党员",
]);
const colleges = ref([]);
const currentcollege = ref("全部");
//获取党支部分类
async function getColleges() {
  const res = await request.get("/get-all-college");

  colleges.value = res.data;
}

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
onMounted(async () => {
  await initGetUsersList();
  getColleges();
});
//获取学生数据
async function initGetUsersList(page = 1) {
  // tableData.value = await getUser(queryForm.value).users;
  const res = await request.get("/getAllStudent-back", {
    keyword: currentcollege.value,
    page,
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    baseTableData.value = res.data.data;
    tableData.value = baseTableData.value;
    total.value = res.data.count;
    currentPage = page;
  }
}

//查询
async function getFindList(keywords, page = 1, college) {
  if (findKeyword.value == "") {
    initGetUsersList(currentPage);
  } else {
    const res = await request.get("/findOneStudent-back", {
      keywords,
      page,
      college: currentcollege.value,
    });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      total.value = res.data.count;
      currentPage = page;
    }
  }
}

//循环获取所有数据
async function getAllData() {
  let allData = [];
  let currentPage = 1;
  const pageSize = 10; // 每页的数据条数

  // 循环调用接口，直到获取所有数据
  while (true) {
    let res = "";

    if (findKeyword.value != "") {
      res = await request.get("/findOneStudent-back", {
        keywords: findKeyword.value,
        page: currentPage,
        college: currentcollege.value,
      });
    } else {
      res = await request.get("/getAllStudent-back", {
        keyword: currentcollege.value,
        page: currentPage,
      });
    }
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
      return [];
    } else {
      const newData = res.data.data;
      allData = allData.concat(newData);

      // 如果当前页数据不满一页，则说明已经获取完所有数据
      if (newData.length < pageSize) {
        break;
      }

      currentPage++;
    }
  }
  return allData;
}

//导出为excel
const exportExcel = async () => {
  let allData = await getAllData();
  if (!allData || !allData.length || !allData[0]) {
    // 如果数据无效或者为空，则提示用户，不执行后续的 Excel 生成逻辑
    return ElMessage.error("没有可导出的数据！");
  }

  allData = allData.map((item) => {
    // 如果awards字段存在，且为数组，替换为数组长度
    if (Array.isArray(item.awards)) {
      return { ...item, awards: item.awards.length };
    }
    // 如果awards字段不存在，或不是数组，保持不变
    else {
      return item;
    }
  });
  // 获取列名，假设第一行是列名
  const headers = Object.keys(allData[0]);
  // 计算每列的最大宽度
  const maxWidths = headers.map((header) => {
    const maxWidth = allData.reduce((maxWidth, row) => {
      const cellValue = row[header];
      const cellWidth =
        cellValue && typeof cellValue === "string"
          ? Math.max(Math.min(cellValue.length * 6, 140), 70)
          : 60;
      return Math.max(maxWidth, cellWidth);
    }, 0);
    return maxWidth;
  });
  // 使用 SheetJS 创建工作簿
  const ws = XLSX.utils.json_to_sheet(allData);
  XLSX.utils.sheet_add_aoa(ws, [stu_title], { origin: "A1" });
  ws["!cols"] = maxWidths.map((wpx) => ({ wpx }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // 生成 Excel 文件的 Blob
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  // 字符串转 ArrayBuffer 函数
  function s2ab(s) {
    const buffer = new ArrayBuffer(s.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buffer;
  }
  // 保存为 Excel 文件
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  saveAs(blob, "学生信息.xlsx");
};

//修改
const changeStatus = (row) => {
  request.post("/updateStatus", { _id: row._id, status: row.status });
};
//分页
async function currentChange(event) {
  currentPage = event;
  getFindList(findKeyword.value, event);
}

//传值
const handleDialogValue = (row) => {
  dialogTitle.value = "查看信息";
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
    const res = await request.get("/delOneStudent-back", { _id: row._id });

    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      initGetUsersList(currentPage);
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
  
  <style >
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
  