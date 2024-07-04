<template>
  <div class="home">
    <h1 class="name">
      新心向党，星火燃梦--青年入党材料数字化管理与党性教育辅助系统
    </h1>
    <div class="box">
      <div class="title">
        自党的十九大以来，以习近平总书记为核心地党中央高度重视加强青年党员队伍建设工作。习近平总书记强调，党的队伍中始终活跃着怀抱崇高理想、充满奋斗精神的青年人，是党依旧充满生机活力的重要原因。调动青年入党积极性，加强青年党性教育，培育青年爱党奉献精神，与党的未来与发展密切相关。
        为响应国家和党中央号召，解决高校入党流程管理不便，实践成果验收不便，青年大学生对党教知识了解不全面，党性教育培养不完善等问题。我们团队积极结合学科、专业知识，实现了“新‘心’向党，星火燃梦---青年入党数字化管理与党性教育辅助系统”。将软件开发技术有机融入青年入党流程的管理中以智慧和高效地数字化管理辅助青年入党工作的实施。本系统通过文字，图片，视频，AI问答，题库等多种形式促进青年对党教知识的学习，通过志愿活动，积分赢礼，党建论坛等模式加强党性教育的培养。从而协助高校对入党流程的管理与验收、进一步丰富学生对党教知识的学习、调动青年入党和志愿服务的积极性、加强青年入党爱党的党性教育。培育这些未来的新兴力量，为我们党中央的建设添砖加瓦，焕发出新的活力与生机。
      </div>
      <img class="image" src="@/assets/xiaochengxu.png" />
      <div class="down">
        <div class="twobutton">
          <div class="anddownload">
            <el-button type="primary" color="#e44a4a" @click="and">
              <span style="font-size: 22px">微信小程序</span>
            </el-button>
          </div>
        </div>
        <div class="admin">
          <el-button type="primary" color="#e44a4a" @click="toLogin">
            <span style="font-size: 22px">管理员入口</span>
            <img src="@/assets/rukou.png" alt="" />
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      :center="true"
      :align-center="true"
      width="40%"
      v-model="andshow"
      title="请扫码进入"
      center
    >
      <img class="erCode" src="@/assets/wx.png" />

      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="andshow = false"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";
import { ref } from "vue";
const andshow = ref(false);
const appshow = ref(false);

const and = () => {
  ElMessageBox.alert(
    "本小程序还未正式上线，仅为体验版，请体验者扫码体验版二维码，请求体验，我们将于24小时之内审核，通过申请，申请通过后，再次扫描二维码即可登录，如需加急，请拨打电话：15315971169。（温馨提示：本系统面向高校，若初次登录注册后，需要进行严格登录，若未通过学生或管理员权限的用户无法登录，请使用获取权限的账号密码登录本系统）",
    "提示",
    {
      confirmButtonText: "OK",
    }
  );
  andshow.value = true;
};
const app = () => {
  appshow.value = true;
};
const toLogin = () => {
  router.push("./Login");
};
</script>
  <style lang="scss" scoped>
.name {
  text-align: center;
  color: #e44a4a;
  margin-top: 110px;
  font-size: 40px;
  font-weight: bolder;
  padding-left: 300px;
  width: 70%;
}
.home {
  //   background-image: url("@/assets/office-2240932_1920.png");
  background-image: url("https://yes-1317567548.cos.ap-nanjing.myqcloud.com/img%26vdo/houtaifengmian2.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;

  .box {
    display: flex; /* 使用 Flexbox 布局 */
    justify-content: space-between; /* 将子元素平均分布在主轴上 */
    margin: 50px 0 0 100px;
    width: 100%;
    .title {
      text-indent: 48px;
      color: #b92c2c;
      font-size: 22px;
      width: 60%;
    }
    .img img {
      margin-left: 50px;
      width: 480px;
      height: 1300px;
    }
    .down {
      margin: 80px 100px 30px 100px;
      width: 200px;
      height: 300px;
      width: 48%;

      .twobutton {
        display: flex;
        justify-content: space-between;
        .anddownload {
          text-align: center;
          width: 250px;
          height: 100px;
          color: #fff;
          .el-button {
            height: 120px;
            width: 340px;
          }
          span {
            display: inline-block;
            margin-right: 10px;
          }
          img {
            height: 50px;
          }
        }
      }
      .admin {
        .el-button {
          width: 340px;
          height: 120px;
          margin-top: 30px;
        }
        img {
          width: 50px;
          height: 50px;
          margin-left: 20px;
        }
      }
    }
  }

  .image {
    margin-left: 70px;
    width: 550px;
    height: 600px;
  }
}
.beian {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  color: #fff;
}
.erCode {
  object-fit: contain;
  padding: 0 8vw;
  width: 400px;
  height: 400px;
}
</style>
  