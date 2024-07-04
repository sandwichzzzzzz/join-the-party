import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    //登录界面
    path: "/login",
    name: "login",
    component: () => import("@/page/login/login.vue"),
  },
  {
    //登录界面
    path: "/",
    name: "inlet",
    component: () => import("@/page/inlet/index.vue"),
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/page/index/index.vue"),
    redirect: "/analysis",
    // 二级路由
    children: [
      {
        //数据分析
        path: "/analysis",
        name: "analysis",
        component: () => import("@/page/data-analysis/index.vue"),
      },
      {
        //学院管理
        path: "/CollegeAndBranch",
        name: "CollegeAndBranch",
        component: () => import("@/page/collegeAndBranch-manage/index.vue"),
      },
      {
        //党支部管理
        path: "/Branch-manag",
        name: "Branch-manag",
        component: () =>
          import("@/page/collegeAndBranch-manage/Brand-manag.vue"),
      },
      {
        //推荐动态
        path: "/reco",
        name: "reco",
        component: () => import("@/page/reco/index.vue"),
      },
      {
        //选择推荐动态
        path: "/reco-upload",
        name: "reco-upload",
        component: () => import("@/page/reco/upload.vue"),
      },
      {
        //奖品管理
        path: "/gift-manag",
        name: "gift-manag",
        component: () => import("@/page/gift-manag/index.vue"),
      },
      {
        //动态管理
        path: "/forum-manage",
        name: "forum-manage",
        component: () => import("@/page/forum-manage/index.vue"),
      },
      {
        //权限管理
        path: "/jurisdic-manag",
        name: "jurisdic-manag",
        component: () => import("@/page/jurisdic-manag/index.vue"),
      },
      {
        //用户管理
        path: "/user-manag",
        name: "user-manag",
        component: () => import("@/page/user-manag/index.vue"),
      },
      {
        //导航设置
        path: "/nav-settings",
        name: "nav-settings",
        component: () => import("@/page/nav-settings/index.vue"),
      },
      {
        //推荐文章
        path: "/reco",
        name: "reco",
        component: () => import("@/page/reco/index.vue"),
      },
      {
        //选择文章
        path: "/reco-upload",
        name: "reco-upload",
        component: () => import("@/page/reco/upload.vue"),
      },
      {
        //文章管理
        path: "/information-manag",
        name: "information-manag",
        component: () => import("@/page/information-manag/index.vue"),
      },
      {
        //学生信息管理
        path: "/stuInfor-manag",
        name: "stuInfor-manag",
        component: () => import("@/page/stuInfor-manag/index.vue"),
      },
      {
        //题库管理
        path: "/quest-bank-manag",
        name: "quest-bank-manag",
        component: () => import("@/page/quest-bank-manag/index.vue"),
      },
      {
        //活动模块
        path: "/activity-manag",
        name: "activity-manag",
        component: () => import("@/page/activity-manag/index.vue"),
      },
      {
        //报名详情
        path: "/regist-manag",
        name: "registration-manag",
        component: () => import("@/page/activity-manag/regist-manag.vue"),
      },
      {
        //五一活动模块
        path: "/wy-ac-detail",
        name: "wy-ac-detail",
        component: () => import("@/page/wy-detail/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes,
});

export default router;
