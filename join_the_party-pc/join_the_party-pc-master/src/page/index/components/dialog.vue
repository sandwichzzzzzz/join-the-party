<template>
  <el-dialog title="个人信息修改" width="50%">
    <!-- <div id="Content-page">
      <div class="content-main">

      </div>
    </div> -->
    <div>
      <div class="admin-user-Infor">
        <div v-if="!modify">
          <img :src="adminData.avatarUrl" alt="" />
          <div>
            <p>昵称：{{ adminData.nickname }}</p>
            <p>职务：{{ adminData.position }}</p>
          </div>
        </div>
      </div>

      <div v-if="modify" class="admin-user-Infor">
        <div>
          <el-upload
            ref="uploadEle"
            :action="imageUrl"
            accept=".jpg,.png,.jpeg,.webp"
            :limit="1"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <div class="left-upload left-upload-icon">
              <div class="left-upload-icon" v-if="uploadImgurl == ''">
                <el-icon :size="20"><Plus /></el-icon>
                <span>上传新的头像，建议上传大小不超过500kb</span>
              </div>
              <div v-else>
                <img :src="uploadImgurl" alt="" />
              </div>
            </div>
          </el-upload>
        </div>
        <div class="admin-user-Infor">
          <el-input
            :placeholder="adminData.nickname"
            v-model="nickname"
            class="right-upload-input"
          />
        </div>
        <div class="admin-user-Infor">
          <el-input
            :placeholder="adminData.position"
            v-model="position"
            class="right-upload-input"
          />
        </div>

        <div class="right-upload-button">
          <el-button
            type="success"
            class="submit-button"
            :loading="loadIng"
            @click="subMit"
            >提交</el-button
          >
        </div>
      </div>
      <div class="right-upload-button">
        <el-button
          class="submit-button"
          type="primary"
          @click="modify = !modify"
        >
          {{ modify ? "取消修改" : "修改" }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
// 顶部导航组件
import { Plus } from "@element-plus/icons-vue";
import { ref, onMounted, reactive } from "vue";
import { imageUrl } from "@/api/request.js";
import { ElMessage } from "element-plus";
import request from "@/api/request.js";
import emitter from "@/api/event.js";
// 获取本地缓存的管理员数据
const adminData = reactive({
  avatarUrl: "",
  nickname: "",
  _id: "",
  position: "",
});
onMounted(() => {
  const { avatarUrl, nickname, _id, position } = JSON.parse(
    localStorage.getItem("adminInfor")
  );
  adminData._id = _id;
  adminData.avatarUrl = avatarUrl;
  adminData.nickname = nickname;
  adminData.position = position;
});

// 显示||隐藏右边修改
const modify = ref(false);
// 提交按钮loading
const loadIng = ref(false);
// 未上传和已上传的图片展示
const uploadImgurl = ref("");
const uploadEle = ref(null);

//图片&&视频上传
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.code === 200) {
    uploadImgurl.value = response.data.url;
    uploadEle.value.clearFiles();
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  } else {
    ElMessage({
      message: "上传失败",
      type: "error",
    });
  }
};
// 昵称
const nickname = ref("");
// 职称
const position = ref("");
// 提交
async function subMit() {
  try {
    loadIng.value = true;
    await request.post("/modify-SAdminInfor", {
      _id: adminData._id,
      avatarUrl: uploadImgurl.value,
      nickname: nickname.value,
      position: position.value,
    });
    const getadminInfor = JSON.parse(localStorage.getItem("adminInfor"));
    getadminInfor.avatarUrl = uploadImgurl.value;
    getadminInfor.nickname = nickname.value;
    getadminInfor.position = position.value;
    localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
    adminData.avatarUrl = uploadImgurl.value;
    adminData.nickname = nickname.value;
    adminData.position = position.value;
    uploadImgurl.value = "";
    nickname.value = "";
    position.value = "";
    modify.value = false;
    emitter.emit("upload-Admin-Success");
    loadIng.value = false;
  } catch (error) {
    loadIng.value = false;
  }
}
</script>

<style scoped>
.admin-user-Infor img {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  object-fit: cover;
}
.left-upload {
  border: 1px dashed rgba(0, 0, 0, 0.3);
  color: rgba(0, 0, 0, 0.3);
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
}
.left-upload-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.left-upload img {
  width: 200px;
  height: 203px;
  object-fit: cover;
}

.right-upload-input {
  width: 200px;
  text-align: center;
}
.right-upload-input p {
  height: 40px;
  line-height: 40px;
}
.el-dialog {
  display: flex;
  justify-content: center;
}

.admin-user-Infor {
  text-align: center;
}

.right-upload-input,
.right-upload-button {
  margin-top: 10px; /* 根据需要调整上边距 */
  margin-bottom: 10px; /* 根据需要调整上边距 */
}
</style>
