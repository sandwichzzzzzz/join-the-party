<template>
  <div id="Content-page">
    <Paging
      :pagData="[
        { name: '活动管理', router: '/activity-manag' },
        { name: '报名详情', router: '/regist-manag' },
      ]"
    />
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
      </el-row>
      <el-table :data="tableData" style="width: 100%"
        >活动发布者的uid
        <el-table-column prop="username" label="打卡人" />
        <el-table-column prop="clockTitle" label="打卡标题" />
        <el-table-column width="250px" prop="clockThink" label="活动感想" />
        <el-table-column prop="clockTime" label="打卡时间" />
        <el-table-column prop="clockPosition" label="打卡地点" />
        <el-table-column prop="evaluate" label="评分" />
        <el-table-column width="100px" prop="checkGrade" label="审核结果" />
        <el-table-column width="120px" prop="clockThink" label="打卡内容">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="drawerView(scope.row.acUid, scope.$index)"
              >查看全部</el-button
            >
          </template>
        </el-table-column>
        <el-table-column width="90px" label="删除">
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
        <el-carousel-item
          v-for="(item, index) in tableData[activityIndex].clockImage"
          :key="index"
        >
          <el-image
            style="width: 100%; height: 300px"
            :src="item"
            :zoom-rate="1.2"
            :preview-src-list="tableData[activityIndex].clockImage"
            :initial-index="index"
            preview-teleported
            fit="cover"
          />
        </el-carousel-item>
      </el-carousel>
      <!-- 发布管理员 -->
      <div class="author-view drawer-view global-display global-a-items">
        <img :src="tableData[activityIndex].avatarUrl$" alt="" />
        <div>
          <p>
            打卡人:
            {{ tableData[activityIndex].username }}
          </p>
          <p>
            所属党支部:
            {{ tableData[activityIndex].partyBranch }}
          </p>
        </div>
      </div>
      <!-- 活动信息 -->
      <div class="drawer-view article-city global-display global-f-wrap">
        <p>
          <el-icon><UserFilled /></el-icon>
          审核结果:
          {{ tableData[activityIndex].checkGrade }}
        </p>

        <p>
          <el-icon><Clock /></el-icon> 打卡时间:
          {{ tableData[activityIndex].clockTime }}
        </p>
        <p>
          <el-icon><Position /></el-icon> 打卡地点:
          {{ tableData[activityIndex].clockPosition }}
        </p>
        <p>
          <el-icon><User /></el-icon> 打卡详情:
          {{ tableData[activityIndex].clockDetails }}
        </p>
      </div>
      <!-- 标题，内容 -->
      <div class="drawer-view author-essay">
        <p>{{ tableData[activityIndex].clockTitle }}</p>
        <p>{{ tableData[activityIndex].clockThink }}</p>
      </div>
      <div style="height: 300px"></div>
    </el-drawer>
  </div>
</template>
    
<script setup>
// 顶部导航组件
import Paging from "@/page/component/Paging-component.vue";
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
import { ref, onMounted } from "vue";
import request from "@/api/request.js";

const tableData = ref([]);

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
onMounted(async () => {
  await requestApi();
  // await fetchBranchList();
  tableData.value = baseTableData.value;
});

// 活动管理
const baseTableData = ref([]);
const count = ref(1);
let currentPage = 1;
async function requestApi(page = 1) {
  // 获取存储的活动详情对象
  const Deta_punch = JSON.parse(localStorage.getItem("Deta_punch"));

  const res = await request.get("/signup-back-home", {
    _id: Deta_punch._id,
    page,
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    count.value = res.data.count;
    baseTableData.value = res.data.data;
    currentPage = page;
    tableData.value = baseTableData.value;
  }
}

const findKeyword = ref("");
async function getFindList(keywords, page = 1) {
  if (keywords == "") {
    requestApi(currentPage);
  } else {
    const res = await request.get("/signup-back-home", { keywords, page });
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
    const res = await request.get("/deleteSignUp", {
      _id: index,
    });
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      requestApi(currentPage);
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
// const newPage = ref(1);
//查看更多
async function drawerView(_id, index) {
  activityId.value = _id;
  activityIndex.value = index;
  drawer.value = true;
}
</script>
    
    <style>
.header > * {
  margin-right: 20px;
}
/* 党支部分类颜色 */
.el-dropdown-link {
  cursor: pointer;
  color: skyblue;
  display: flex;
  align-items: center;
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
</style>