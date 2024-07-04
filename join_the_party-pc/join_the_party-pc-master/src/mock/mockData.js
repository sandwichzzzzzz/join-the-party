// mockData.js
import Mock from "mockjs";

// 模拟登入
Mock.mock("http://127.0.0.1:8900/adminLogin", "post", {
  code: 200,
  message: "登录成功",
  data: {
    token: "wwww",
    mobile: 111111,
    password: "111111",
  },
});

//模拟活动模块
Mock.mock("http://127.0.0.1:8900/apif/activity-details", "get", {
  code: 200,
  message: "获取活动数据成功",
  data: {
    pub_data: [
      {
        avatarUrl:
          "https://i2.hdslb.com/bfs/face/31446d57ffc3df9806ae6922767e75118a128630.jpg@96w_96h_1c_1s_!web-avatar.avif",
        adminName: "11",
      },
    ],
    acid: "123",
    acTitle: "第一次大会",
    ac_coverImage:
      "https://i2.hdslb.com/bfs/face/31446d57ffc3df9806ae6922767e75118a128630.jpg@96w_96h_1c_1s_!web-avatar.avif",
    acContent: "文章内容",
    regTime: "10月10日",
    acTime: "10月11日",
    acPosition: "十栋10b205",
    acParticipant: "string",
    acAttention: "string",
    canJoinNum: "string",
    vulHour: "string",
    vulSource: "string",
    time: "string",
    timestamp: "string",
  },
});

// 其他接口的模拟可以继续添加

export default Mock;
