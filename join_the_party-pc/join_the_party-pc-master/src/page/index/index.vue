<template>
  <el-header style="text-align: right; font-size: 12px; padding: 0px">
    <!-- 顶部 -->
    <div class="toolbar">
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px"> <Tools /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogVisible = true"
              >查看</el-dropdown-item
            >
            <el-dropdown-item @click="exitLogin">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="merchant-style global-display global-a-items">
        <img :src="merchantName.avatUrl" alt="" />
        <p>{{ merchantName.name }}</p>
      </div>
    </div>
  </el-header>
  <div id="nav-left">
    <!-- 左上角logo -->
    <div class="merchant-logo global-display global-a-items">
      <img :src="Logo" alt="" />
      <p>党员管理系统</p>
    </div>
    <!-- 导航栏 -->
    <el-menu
      :default-active="menuId"
      class="menu-container"
      @select="selectActive"
    >
      <div v-for="(item, index) in menuNavData" :key="index">
        <router-link :to="{ path: item.router }">
          <el-menu-item :index="item.id">
            <!-- <span v-if="hoveredItem === item.id">{{ item.title }}</span> -->

            <el-icon class="icon-container" :size="30"
              ><component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </router-link>
      </div>
    </el-menu>
  </div>
  <router-view er-view style="margin-top: 60px"></router-view>
  <Dialog v-model="dialogVisible" v-if="dialogVisible" />
</template>

<script setup>
import { reactive, ref, shallowRef, onMounted } from "vue";
import {
  Star,
  Files,
  DataAnalysis,
  User,
  MessageBox,
  Tools,
  Lock,
  Notebook,
  CopyDocument,
  Suitcase,
  ShoppingTrolley,
  CollectionTag,
  Folder,
} from "@element-plus/icons-vue";
import Logo from "@/assets/logo.jpg";
import { useRouter } from "vue-router";
import emitter from "@/api/event.js";
import Dialog from "./components/dialog.vue";

const $router = useRouter(); // 这是路由跳转的
const dialogVisible = ref(false);
const arrAy = [
  {
    id: "1",
    icon: DataAnalysis,
    title: "数据分析",
    router: "analysis",
    Subclass: [],
  },
  {
    id: "2",
    icon: Folder,
    title: "学院党支部管理",
    router: "CollegeAndBranch",
    Subclass: [],
  },
  {
    id: "3",
    icon: Lock,
    title: "权限管理",
    router: "jurisdic-manag",
    Subclass: [], //是否有二级三级等等菜单
  },

  {
    id: "4",
    icon: User,
    title: "用户管理",
    router: "user-manag",
    Subclass: [], //是否有二级三级等等菜单
  },
  {
    id: "5",
    icon: Files,
    title: "推荐动态",
    router: "reco",
    Subclass: [],
  },
  {
    id: "6",
    icon: CollectionTag,
    title: "动态管理",
    router: "forum-manage",
    Subclass: [],
  },
  {
    id: "7",
    icon: CopyDocument,
    title: "资讯管理",
    router: "information-manag",
    Subclass: [],
  },

  {
    id: "8",
    icon: MessageBox,
    title: "学生信息查询",
    router: "stuInfor-manag",
    Subclass: [],
  },

  {
    id: "9",
    icon: Star,
    title: "活动模块",
    router: "activity-manag",
    Subclass: [],
  },
  {
    id: "10",
    icon: Suitcase,
    title: "党员培训管理",
    router: "wy-ac-detail",
    Subclass: [],
  },
  {
    id: "11",
    icon: Notebook,
    title: "题库管理",
    router: "quest-bank-manag",
    Subclass: [],
  },
  {
    id: "12",
    icon: ShoppingTrolley,
    title: "收获信息管理",
    router: "gift-manag",
    Subclass: [],
  },
];
const menuNavData = shallowRef(arrAy);
const merchantName = reactive({ name: "党员管理系统", avatUrl: Logo });
// 菜单激活回调
function selectActive(index) {
  localStorage.setItem("menuid", JSON.stringify(index));
}
const menuId = ref("1");
onMounted(() => {
  menuId.value = JSON.parse(localStorage.getItem("menuid"));
  adminInfor();
});
function adminInfor() {
  const { avatarUrl, nickname } = JSON.parse(
    localStorage.getItem("adminInfor")
  );
  merchantName.name = nickname;
  merchantName.avatUrl = avatarUrl;
}
// 退出登录
function exitLogin() {
  localStorage.removeItem("adminInfor");
  $router.push("/");
}
// 修改管理员信息触发
emitter.on("upload-Admin-Success", () => {
  adminInfor();
});
</script>

<style>
.toolbar {
  background-color: #ffffff;
  height: 60px; /* 设置导航栏高度 */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px; /* 调整右侧内边距，使得内容在导航栏中居右 */
  border-bottom: 1px solid #ccc; /* 底部边框线条为灰色 */
}
.toolbar .el-dropdown .el-icon {
  font-size: 30px; /* 设置 el-icon 的大小为 25px */
  margin-right: 8px;
  margin-top: 1px;
}

#nav-left {
  left: 0;
  top: 0;
  position: fixed;
  height: 1000vh;
  background-color: #fff;
  width: 200px;
  z-index: 999;
}
#nav-left span {
  font-size: 18px;
  padding-left: 10px;
}

.merchant-style {
  justify-content: center;
  padding: 50px 0;
  flex-direction: column;
}
.merchant-style img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0px;
}
.merchant-style p {
  font-size: 15px;
  font-weight: bold;
}

/* logo */
.merchant-logo {
  justify-content: center;
  padding: 20px 0;
  flex-direction: column;
}
.merchant-logo p {
  font-size: 15px;
  font-weight: bold;
}
.merchant-logo img {
  width: 70px;
  height: 70px;
  border-radius: 95%;
  object-fit: cover;
  margin-bottom: 0px;
}
/* 退出登录 */
.exit-login {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 220px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  z-index: 999;
  border-top: 1px solid #f2f2f2;
  background: #ffffff;
}
.menu-container {
  height: 80%; /* 设置固定的高度 */
  overflow-y: auto; /* 垂直滚动条 */
}
</style>
