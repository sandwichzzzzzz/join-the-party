<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '活动管理', router: '/activity-manag' }]" />
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
        <el-button type="primary" @click="getFindList(findKeyword)"
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
      </el-row>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="acTitle" label="活动名称" />
        <el-table-column prop="acTime" label="发布时间" />
        <el-table-column prop="vulHour" label="志愿时长" />
        <el-table-column prop="acPosition" label="位置" />
        <el-table-column prop="canJoinNum" label="人数" />
        <el-table-column prop="acContent" label="活动内容">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="drawerView(scope.row.acUid, scope.$index)"
              >查看全部</el-button
            >
          </template>
        </el-table-column>
        <el-table-column width="145px" prop="acContent" label="打卡情况">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              @click="jump(scope.row, scope.$index)"
              >查看详情<el-icon class="el-icon--right"><ArrowRight /></el-icon
            ></el-button>
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
          background
          layout="total,prev, pager, next,jumper"
          hide-on-single-pag
          :total="count"
          @current-change="currentChange"
          style="color: aqua"
        />
      </div>
    </div>
    <el-drawer v-model="drawer" :with-header="false">
      <!-- 活动图片 -->
      <el-carousel height="300px" :autoplay="false">
        <el-image
          style="width: 100%; height: 300px"
          :src="tableData[activityIndex].ac_cover_image.url"
          :zoom-rate="1.2"
          fit="cover"
        />
      </el-carousel>
      <!-- 发布管理员 -->
      <div class="author-view drawer-view global-display global-a-items">
        <div>
          <p>
            发布管理员:
            {{ tableData[activityIndex].pub_uid }}
          </p>
          <p>
            所属党支部:
            {{ tableData[activityIndex].pub_college }}
          </p>
        </div>
      </div>
      <!-- 活动信息 -->
      <div class="drawer-view article-city global-display global-f-wrap">
        <p>
          <el-icon><UserFilled /></el-icon>
          活动对象:
          {{ tableData[activityIndex].acPosition }}
        </p>
        <p>
          <el-icon><Clock /></el-icon> 报名时间:
          {{ tableData[activityIndex].regTimeHead }} 至
          {{ tableData[activityIndex].regTimeEnd }}
        </p>
        <p>
          <el-icon><Clock /></el-icon> 活动时间:
          {{ tableData[activityIndex].acTime }}
        </p>
        <p>
          <el-icon><Position /></el-icon> 活动地点:
          {{ tableData[activityIndex].acPosition }}
        </p>
        <p>
          <el-icon><User /></el-icon> 活动人数:
          {{ tableData[activityIndex].canJoinNum }}
        </p>
      </div>
      <!-- 标题，内容 -->
      <div class="drawer-view author-essay">
        <p>{{ tableData[activityIndex].acTitle }}</p>
        <p>{{ tableData[activityIndex].acContent }}</p>
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
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import request from "@/api/request.js";
import { useRouter } from "vue-router";

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
async function getColleges() {
  const res = await request.get("/get-all-college");
  colleges.value = res.data;
}
onMounted(async () => {
  await requestApi();
  getColleges();
});

// 活动管理
const findKeyword = ref("");
const colleges = ref([]);
const currentcollege = ref("全部");
const tableData = ref([]);
const count = ref(1);
let currentPage = 1;
async function requestApi(currentPage = 1) {
  const res = await request.get("/activity-back-home", {
    college: currentcollege.value,
    page: currentPage,
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    count.value = res.data.count;
    tableData.value = res.data.data;
  }
}

//查询
async function getFindList(keywords, page = 1) {
  if (findKeyword.value == "") {
    requestApi(currentPage);
  } else {
    const res = await request.get("/findActivity", {
      keywords,
      page,
      college: currentcollege.value,
    });
    if (isNull(res)) {
      ElMessage.error("获取数据为空");
    } else {
      tableData.value = res.data.data;
      count.value = res.data.count;
    }
  }
}
const $router = useRouter(); // 这是路由跳转的
// 跳转到打卡详情

function jump(_id, index) {
  // 存储查看的打卡详情活动的id
  localStorage.setItem("Deta_punch", JSON.stringify(_id));
  $router.push("/regist-manag");
}

// 删除
async function handleDelte(index) {
  try {
    // 弹出删除确认框
    await ElMessageBox.confirm("你确定要永久删除这个活动吗?", "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 用户确认删除
    const res = await request.get("/deleteActivity", { _id: index });

    // 根据服务器响应结果处理反馈信息
    if (res.msg === "SUCCESS") {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });

      // 可能需要重新加载数据或更新视图，依赖于具体的前端框架或实现
      getFindList(findKeyword.value);
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
.header > * {
  margin-right: 20px;
}
</style>