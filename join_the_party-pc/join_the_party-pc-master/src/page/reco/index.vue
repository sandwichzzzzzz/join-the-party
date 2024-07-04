<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '推荐动态', router: '/reco' }]" />
    <div class="content-main">
      <div class="global-display subbuttom">
        <el-button
          type="success"
          :disabled="recoInforma.length >= 4"
          class="subbuttom"
          @click="juMp"
          >选择动态</el-button
        >
      </div>
      <div
        class="uoload-recom global-display global-a-items"
        v-for="(item, index) in recoInforma"
        :key="index"
      >
        <div>
          <img :src="item.imageUrl" />
        </div>
        <div>
          <p class="text-show">{{ item.title }}</p>
          <!-- <p>标题：{{ item.nickname }}</p> -->
          <p>学院：{{ item.college }}</p>
          <p>添加时间：{{ item.time }}</p>
          <p>添加时间：{{ item.articleTime }}</p>
        </div>
        <div>
          <el-button
            type="primary"
            size="default"
            @click="modify(item._id, item.imageUrl)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="default"
            @click="deleteRecom(item._id, index)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 顶部导航组件
import Paging from "@/page/component/Paging-component.vue";
import { ref, onMounted } from "vue";
import request from "@/api/request.js";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
const $router = useRouter(); // 这是路由跳转的

const total = ref(0);
// 跳转
function juMp() {
  $router.push("/reco-upload");
}
const recoInforma = ref([]);
onMounted(async () => {
  await initGetUsersList();
});

const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};
async function initGetUsersList(page = 1) {
  const res = await request.get("/gainRecomForum", { page });
  console.log("res", res);
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    recoInforma.value = res.data;
  }
}

// 修改
function modify(_id, imageUrl) {
  $router.push({ path: "/daily-recom-upload", query: { _id, imageUrl } });
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
    await request.get("/deleteRecomForum", { _id });
    recoInforma.value.splice(index, 1);
  } catch (error) {}
}
</script>

<style scoped>
@import "@/style/index.css";
</style>