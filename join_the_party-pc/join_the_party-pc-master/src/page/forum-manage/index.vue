<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '动态管理', router: '/forum-manage' }]" />
    <div class="content-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="author_data[0].nickname"
          label="作者"
          width="180"
        />
        <el-table-column prop="time" label="发布时间" />
        <el-table-column prop="college" label="发布学院" />
        <!-- <el-table-column prop="branch" label="发布支部" /> -->
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="drawerView(scope.row._id, scope.$index)"
              >查看全部</el-button
            >
            <el-button
              type="danger"
              size="default"
              @click="deleteRecom(scope.row._id, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pager-next">
        <el-pagination
          background
          layout="prev, pager, next"
          hide-on-single-page
          :total="count"
          @current-change="currentChange"
        />
      </div>
    </div>
    <el-drawer v-model="drawer" :with-header="false">
      <!-- 图文 -->
      <el-carousel
        height="300px"
        :autoplay="false"
        v-if="tableData[forumIndex].fileType == 'image'"
      >
        <el-carousel-item
          v-for="(item, index) in tableData[forumIndex].image"
          :key="index"
        >
          <el-image
            style="width: 100%; height: 300px"
            :src="item"
            :zoom-rate="1.2"
            :preview-src-list="tableData[forumIndex].image"
            :initial-index="index"
            preview-teleported
            fit="cover"
          />
        </el-carousel-item>
      </el-carousel>
      <!-- 视频 -->
      <div class="forum-video" v-else>
        <video width="100%" height="300" loop controls v-if="drawer">
          <source :src="tableData[forumIndex].videoUrl.url" type="video/mp4" />
        </video>
      </div>
      <!-- 作者 -->
      <div class="author-view drawer-view global-display global-a-items">
        <img :src="tableData[forumIndex].author_data[0].avatarUrl" alt="" />
        <div>
          <p>{{ tableData[forumIndex].author_data[0].nickname }}</p>
          <p>{{ tableData[forumIndex].time }}</p>
        </div>
      </div>
      <!-- 发布学院支部 -->
      <div
        class="drawer-view forum-college-branch global-display global-f-wrap"
      >
        <p>{{ tableData[forumIndex].college }}</p>
        <p>{{ tableData[forumIndex].branch }}</p>
      </div>
      <!-- 标题，内容 -->
      <div class="drawer-view author-essay">
        <p>{{ tableData[forumIndex].title }}</p>
        <p>{{ tableData[forumIndex].content }}</p>
      </div>
      <!-- 评论器 -->
      <div
        class="drawer-view Comment-message"
        v-if="userMessageData.length > 0"
      >
        <div
          class="Comment-users global-display"
          v-for="(item, index) in userMessageData"
          :key="index"
        >
          <img :src="item.comment_user[0].avatarUrl" alt="" />
          <div>
            <p>{{ item.comment_user[0].nickname }}</p>
            <p>{{ item.content }}</p>
          </div>
        </div>
        <span
          class="loadMore"
          v-if="userMessageData.length >= 5"
          @click="moreMessage"
          >{{ moreTitle }}</span
        >
      </div>
      <div style="height: 300px"></div>
    </el-drawer>
  </div>
</template>

<script setup>
// 顶部导航组件
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import request from "@/api/request.js";
import { ElMessage, ElMessageBox } from "element-plus";

onMounted(async () => {
  await requestApi();
});
// 用户的文章
const tableData = ref([]);
const count = ref(1);
async function requestApi(page = 1) {
  const res = await request.get("/forum-back-home", { page });
  count.value = res.data.count;
  tableData.value = res.data.data;
}
// 分页
async function currentChange(event) {
  await requestApi(event);
}
// 弹窗展示
const drawer = ref(false);
const forumId = ref("");
const forumIndex = ref(0);
async function drawerView(_id, index) {
  forumId.value = _id;
  forumIndex.value = index;
  newPage.value = 1;
  moreTitle.value = "查看更多";
  messAge(_id);
  drawer.value = true;
}
// 用户评论数据
const userMessageData = ref([]);
// 获取评论数据
async function messAge(forum_id, page = 1) {
  const res = await request.get("/comment-datas", { forum_id, page });
  userMessageData.value = res.data;
}
// 更多评论
const newPage = ref(1);
const moreTitle = ref("查看更多");
async function moreMessage() {
  newPage.value++;
  const res = await request.get("/comment-datas", {
    forum_id: forumId.value,
    page: newPage.value,
  });
  userMessageData.value = [...userMessageData.value, ...res.data];
  moreTitle.value = res.data.length > 0 ? "查看更多" : "没有更多了";
}
// 删除
async function deleteRecom(_id, index) {
  try {
    await ElMessageBox.confirm("确定删除吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });
    await request.get("/delForum-back", { _id });
    tableData.value.splice(index, 1);
  } catch (error) {}
}
</script>

<style>
.el-drawer__body {
  padding: 0 !important;
}
.drawer-view {
  margin: 10px;
}
.forum-video video {
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
.forum-college-branch p {
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