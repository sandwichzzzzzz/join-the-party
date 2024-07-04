<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '收获信息管理', router: '/gift-manag' }]" />
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
        <el-button-group>
          <el-button
            type="primary"
            :disabled="currentPost == '已发放'"
            @click="
              ((currentPost = '已发放'), (isPost = true)),
                getFindList(keyword),
                changecc()
            "
            >已发放</el-button
          >
          <el-button
            type="primary"
            :disabled="currentPost != '已发放'"
            @click="
              ((currentPost = '未发放'), (isPost = false)),
                getFindList(keyword),
                changecc()
            "
            >未发放</el-button
          >
        </el-button-group>
        <el-select
          v-model="currentAc"
          class="m-2"
          size="large"
          style="width: 15%"
        >
          <el-option
            v-for="item in Acs"
            :key="item.acName"
            :label="item.acName"
            :value="item.acNumber"
            @click="getFindList(keyword, currentPage, item.acNumber)"
          />
        </el-select>
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
            <el-switch
              v-model="row.cc"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              active-text="已发放"
              inactive-text="未发放"
              @change="changeIsPost(row)"
            />
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
const dialogTableValue = ref({});
const currentPage = ref(1);
const currentPost = ref("已发放");
const isPost = ref(true);
const Acs = ref([
  { acName: "挂件盲盒", acNumber: "a" },
  { acName: "书本盲盒", acNumber: "b" },
  { acName: "水笔盲盒", acNumber: "c" },
  { acName: "T恤盲盒", acNumber: "d" },
  { acName: "雨伞盲盒", acNumber: "e" },
  { acName: "水杯盲盒", acNumber: "f" },
  { acName: "台灯盲盒", acNumber: "g" },
  { acName: "玩偶盲盒", acNumber: "h" },
  { acName: "平板盲盒", acNumber: "i" },
]);
const currentAc = ref(Acs.value[0].acNumber);

onMounted(async () => {
  await initGetUsersList();
});
async function initGetUsersList(acNumber = "a", page = 1) {
  const res = await request.get("/calculateScores", {
    page,
    keyword: acNumber,
    isPost: currentPost.value,
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    tableData.value = res.data.data;
    total.value = res.data.count;
  }
  changecc();
}
async function getFindList(keywords, page = 1) {
  if (keywords == "") {
    initGetUsersList(currentAc.value, page);
  } else {
    const res = await request.get("/findGiftExchange", {
      searchkeywords: keywords,
      page,
      keyword: currentAc.value,
      isPost: currentPost.value,
    });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      total.value = res.data.count;
    }
  }
}
//修改
const changeIsPost = async (row) => {
  let ipost = 0;
  if (row.cc) {
    ipost = 1;
  } else {
    ipost = 0;
  }

  let number;
  switch (currentAc.value) {
    case "a":
      number = "one";
      break;
    case "b":
      number = "two";
      break;
    case "c":
      number = "three";
      break;
    case "d":
      number = "four";
      break;
    case "e":
      number = "five";
      break;
    case "f":
      number = "six";
      break;
    case "g":
      number = "seven";
      break;
    case "h":
      number = "eight";
      break;
    case "i":
      number = "nine";
      break;
    default:
      number = "unknown";
      break;
  }

  const res = await request.get("/changePost", {
    _id: row._id,
    ispost: ipost,
    number: number,
  });

  if (res.msg === "SUCCESS") {
    ElMessage({
      type: "success",
      message: "更改成功！",
    });
  } else {
    ElMessage({
      type: "warning",
      message: "更改失败: " + res.msg,
    });
  }
};

const changecc = () => {
  // 遍历 tableData 数组中的每个对象
  tableData.value.forEach((item) => {
    item.cc = isPost.value;
  });
};

const handleCurrentChange = (pageNum) => {
  getFindList(keyword.value, pageNum);
  currentPage.value = pageNum;
};

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
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
  