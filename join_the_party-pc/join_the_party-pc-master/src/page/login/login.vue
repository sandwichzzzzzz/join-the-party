<template>
  <div id="login-view">
    <div class="login-region">
      <div class="login-input login-title">入党信息后台管理</div>
      <el-form v-if="change" :model="formData" :rules="rules">
        <el-form-item prop="mobile" class="login-input">
          <el-input
            placeholder="你的手机号"
            v-model="formData.mobile"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password" class="login-input">
          <el-input
            placeholder="你的密码"
            v-model="formData.password"
            clearable
            show-password
          />
        </el-form-item>
        <div></div>
        <el-button
          type="primary"
          :loading="loadIng"
          class="login-input"
          @click="goLogin"
        >
          登录
        </el-button>
      </el-form>
      <el-form v-if="!change" :model="formData" :rules="rules">
        <el-form-item prop="mobile" class="login-input">
          <el-input
            placeholder="你的手机号"
            v-model="formData.mobile"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password" class="login-input">
          <el-input
            placeholder="你的密码"
            v-model="formData.password"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item prop="school" class="login-input">
          <el-input
            placeholder="你的学校"
            v-model="formData.school"
            clearable
          />
        </el-form-item>
        <div></div>
        <el-button
          type="primary"
          :loading="loadIng"
          class="login-input"
          @click="sginup"
        >
          注册
        </el-button>
      </el-form>
      <el-link v-if="!change" @click="change = true" type="primary"
        >登录</el-link
      >
      <el-link v-if="change" @click="change = false" type="primary"
        >注册</el-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import request from "@/api/request.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const $router = useRouter();
const formData = reactive({
  mobile: "",
  password: "",
  school: "",
});
const change = ref(true);

const loadIng = ref(false);

const rules = {
  mobile: [
    {
      required: true,
      message: "手机号不能为空",
      trigger: "blur",
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入有效的手机号",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
    {
      min: 6,
      max: 20,
      message: "密码长度应为6到20位",
      trigger: "blur",
    },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
      message: "密码必须包含数字和字母，且长度为6到20位",
      trigger: "blur",
    },
  ],

  school: [
    {
      required: true,
      message: "学校不能为空",
      trigger: "blur",
    },
  ],
};

async function goLogin() {
  try {
    loadIng.value = true;
    // formData.validate(); Validate the form before submitting
    const res = await request.post("/school-admin-login", {
      mobile: formData.mobile,
      password: formData.password,
    });
    localStorage.setItem("menuid", JSON.stringify("1"));
    localStorage.setItem("adminInfor", JSON.stringify(res.data));
    loadIng.value = false;
    $router.push("/index");
  } catch (error) {
    loadIng.value = false;
    ElMessage.error(error);
  }
}
async function sginup() {
  try {
    loadIng.value = true;
    const res = await request.post("/school-admin-registration", {
      mobile: formData.mobile,
      password: formData.password,
      school: formData.school,
    });

    ElMessage({
      type: "success",
      message: "注册成功！快去登陆吧！",
    });
    loadIng.value = false;
    change.value = true;
  } catch (error) {
    loadIng.value = false;
    ElMessage.error("注册失败");
  }
}
</script>

<style>
#login-view {
  background-image: url("@/assets/WechatIMG500.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 125vh;
}
.login-region {
  position: absolute;
  transform: translate(16%, 30%);
  background-color: #ffffff;
  padding: 50px 100px 10px 100px;
  border-radius: 10px;
  height: 70vh;
  width: 25vw;
  /* background-color: #3a73c2; */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
}
.login-input {
  margin: 30px 0;
  width: 25vw;
}
.login-title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  background-color: inherit !important;
  color: #3a73c2;
}
.login-region div {
  background-color: #f6f7f9;
}
</style>
