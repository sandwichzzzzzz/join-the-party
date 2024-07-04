<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '党员培训管理', router: '/wy-ac-detail' }]" />
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
        <el-text class="mx-1" type="primary" size="large">活动:</el-text>
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
            @click="getFindList(findKeyword, currentPage, item.acNumber)"
          />
        </el-select>
      </el-row>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="student.username" label="姓名" />
        <el-table-column prop="student.partyMembrtType" label="党员类型" />
        <el-table-column width="70%" prop="student.age" label="年龄" />
        <el-table-column prop="student.class" label="班级" />
        <el-table-column prop="student.status" label="政治面貌" />
        <el-table-column width="140px" prop="student.studentId" label="学号" />
        <el-table-column
          width="140px"
          prop="student.partyBranch"
          label="所属党支部"
        />
        <el-table-column prop="acContent" label="工作详情">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="drawerView(scope.row._id, scope.$index)"
              >查看全部</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelte(scope.row._id, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pager-next">
        <el-pagination
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="count"
          @current-change="currentChange"
        />
      </div>
    </div>
    <el-drawer v-model="drawer" :with-header="false">
      <!-- 活动图片 -->
      <el-carousel height="300px" :autoplay="false">
        <el-image
          v-for="item in tableData[activityIndex].wy_acImage"
          style="width: 100%; height: 300px"
          :src="item"
          :zoom-rate="1.2"
          fit="cover"
        />
      </el-carousel>
      <div class="author-view drawer-view global-display">
        <img :src="tableData[activityIndex].student.avatarUrl" alt="" />
        <div>
          <p>
            {{ tableData[activityIndex].student.username }}
          </p>
          <p>
            党员类型:
            {{ tableData[activityIndex].student.partyMembrtType }}
          </p>
          <p>
            政治面貌:
            {{ tableData[activityIndex].student.status }}
          </p>
          <p>
            所在班级:
            {{ tableData[activityIndex].student.class }}
          </p>
          <p>
            所属党支部:
            {{ tableData[activityIndex].student.partyBranch }}
          </p>
        </div>
      </div>
      <!-- 活动信息 -->
      <div class="drawer-view article-city global-display global-f-wrap">
        <p>
          <el-icon><UserFilled /></el-icon>
          工作对象:
          {{ tableData[activityIndex].wy_acNumber }}
        </p>

        <p>
          <el-icon><Clock /></el-icon> 工作时间:
          {{ tableData[activityIndex].wy_acTime }}
        </p>
        <p>
          <el-icon><Position /></el-icon> 工作地点:
          {{ tableData[activityIndex].wy_acPosition }}
        </p>
        <p>
          <el-icon><User /></el-icon> 工作备注:
          {{ tableData[activityIndex].wy_acDetails }}
        </p>
        <p v-if="tableData[activityIndex].wy_acNumber == 1">
          <el-icon><Clock /></el-icon> 联系班级:
          {{ tableData[activityIndex].one_className }}
        </p>
        <p v-if="tableData[activityIndex].wy_acNumber == 1">
          <el-icon><Clock /></el-icon> 班级人数:
          {{ tableData[activityIndex].one_classNum }}
        </p>
        <p v-if="tableData[activityIndex].wy_acNumber == 2">
          <el-icon><Clock /></el-icon> 联系寝室:
          {{ tableData[activityIndex].two_roomName }}
        </p>
        <p v-if="tableData[activityIndex].wy_acNumber == 2">
          <el-icon><Clock /></el-icon> 寝室人数:
          {{ tableData[activityIndex].two_roomNum }}
        </p>
        <p v-if="tableData[activityIndex].wy_acNumber == 5">
          <el-icon><Clock /></el-icon> 交流对象:
          {{ tableData[activityIndex].fiv_comObject }}
        </p>

        <p>
          <el-icon><Clock /></el-icon> 工作时间:
          {{ tableData[activityIndex].wy_acTime }}
        </p>
      </div>
      <el-descriptions
        class="margin-top drawer-view"
        :column="2"
        size="small"
        border
        v-for="item in numberData"
        :key="item.student_id"
      >
        <el-descriptions-item
          class="drawer-view"
          v-for="[key, value] in Object.entries(item)"
        >
          <template #label>
            <div>
              <div>{{ key }}:</div>
            </div>
          </template>
          {{ value }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>Remarks</div>
          </template>
          <el-tag size="small">井冈山大学</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="drawer-view author-essay">
        <p>{{ tableData[activityIndex].wy_acTitle }}</p>
        <p>{{ tableData[activityIndex].wy_acContent }}</p>
      </div>
      <div style="height: 300px"></div>
    </el-drawer>
  </div>
</template>
    
    <script setup>
// 顶部导航组件
import {
  ArrowDown,
  ArrowRight,
  Position,
  Clock,
  User,
  UserFilled,
  Search,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import request from "@/api/request.js";

const numberData = ref([]);
const findKeyword = ref("");
const colleges = ref([]);
const currentcollege = ref("全部");
const Acs = ref([
  { acName: "联系一个班级", acNumber: 1 },
  { acName: "对接一个寝室", acNumber: 2 },
  { acName: "帮扶一个学生", acNumber: 3 },
  { acName: "参与一系列社会服务", acNumber: 4 },
  { acName: "开展一次交流", acNumber: 5 },
]);
const currentAc = ref(Acs.value[0].acName);

async function getColleges() {
  const res = await request.get("/get-all-college");
  colleges.value = res.data;
}
onMounted(async () => {
  await requestApi();
  getColleges();
});

// 活动管理
const tableData = ref([]);
const baseTableData = ref([]);
const count = ref(1);
let currentPage = 1;
async function requestApi(acNumber = 1, page = 1) {
  const res = await request.get("/wy-back-home", {
    wy_acNumber: acNumber,
    college: currentcollege.value,
    page,
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    currentAc.value = acNumber;
    count.value = res.data.count;
    baseTableData.value = res.data.data;
    tableData.value = baseTableData.value;
    currentPage = page;
  }
}

//调整活动参数
const filterAc = () => {
  // 对象映射活动类型和对应的数据字段
  const activityDataMap = {
    1: "one_classData",
    2: "two_roomData",
    3: "three_mateData",
  };
  const currentActivity = tableData.value[activityIndex.value];
  const activityNumber = currentActivity.wy_acNumber;
  // 获取对应的数据字段
  const dataField = activityDataMap[activityNumber - 1];
  // 清空numberData并赋值新数据
  numberData.value.splice(
    0,
    numberData.value.length,
    ...(currentActivity[dataField] || [])
  );
};

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

//查询
async function getFindList(keywords, page = 1) {
  if (findKeyword.value == "") {
    requestApi(currentAc.value, currentPage);
  } else {
    const res = await request.get("/wy-search", {
      keywords: keywords,
      page: page,
      college: currentcollege.value,
      wy_acNumber: currentAc.value,
    });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      count.value = res.data.count;
      currentPage = page;
    }
  }
}

// 删除
async function handleDelte(index, row) {
  try {
    // 跳出删除确认框
    await ElMessageBox.confirm("你确定要永久删除这个活动吗?", "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 确认删除
    const res = await request.get("/deleteWyWork", {
      _id: index,
    });

    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      requestApi(currentAc.value, currentPage);
    } else {
      ElMessage({
        type: "warning",
        message: "删除失败: " + res.msg,
      });
    }
    // 更新视图
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

// 分页
async function currentChange(event) {
  currentPage = event;
  getFindList(findKeyword.value, event);
}
// 弹窗展示
const drawer = ref(false);
const activityId = ref("");
const activityIndex = ref(0);

//查看更多
async function drawerView(_id, index) {
  activityId.value = _id;
  activityIndex.value = index;
  filterAc();
  drawer.value = true;
}
</script>
<style>
.header {
  padding-bottom: 20px;
  padding-left: 2%;
}
.header > * {
  margin-right: 20px;
}
.el-drawer__body {
  padding: 0 !important;
}
.drawer-view {
  margin: 10px;
}
.activity-video video {
  height: 300px;
  width: 100%;
  object-fit: cover;
}
.author-view {
  box-shadow: 0 0 15px #ca7e7c33;
  border-radius: 5px;
  padding: 10px;
  background: #ffffff;
}
.author-view img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  display: block;
  border-radius: 50%;
}
.author-view div {
  padding-left: 10px;
}
.author-view p:nth-child(1) {
  font-weight: bold;
}
.article-city p {
  background-color: gold;
  margin: 0 10px 10px 0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  padding: 5px 15px;
}
.author-essay p:nth-child(1) {
  font-weight: bold;
  font-size: 18px;
  padding: 10px 0;
}
.author-essay p:nth-child(2) {
  line-height: 1.5;
}
.Comment-message {
  background-color: #f6f7f9;
}
.Comment-users {
  padding: 20px 10px;
}
.Comment-users div {
  padding-left: 10px;
}
.Comment-users img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.Comment-users p:nth-child(1) {
  color: #8c8c8c;
  padding-bottom: 3px;
}
.loadMore {
  text-align: center;
  display: block;
  padding-bottom: 10px;
  color: blueviolet;
  cursor: pointer;
}
.margin-top {
  width: 80px;
  /* padding: 20px 10px; */
}
/* .cell-item {
  font-size: small;
  padding: 20px 10px;
} */
</style>