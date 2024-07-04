<template>
  <el-dialog
    :title="dialogTitle"
    width="60%"
    :before-close="handleClose"
    v-bind:style="{ background: form.backdrop }"
  >
    <el-form ref="formRef" :model="form" label-width="70px">
      <div>
        <el-main>
          <div style="width: 250px; height: 300px">
            <el-form-item label="用户头像" prop="avatarUrl">
              <el-image
                style="width: 250px; height: 250px"
                :src="form.avatarUrl"
                lazy
                fit="contain"
              />
            </el-form-item>
          </div>
          <el-form-item label="昵称" prop="nickname" style="width: 50%">
            <el-input v-model="form.nickname" disabled />
          </el-form-item>

          <!-- 其他信息项可以按照这个格式添加 -->
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" disabled />
          </el-form-item>

          <el-form-item label="身份" prop="status">
            <el-input v-model="form.status" disabled />
          </el-form-item>

          <!-- 这里是用户标签的展示 -->
          <el-form-item label="用户标签" prop="my_tags">
            <el-tag
              v-for="tag in form.my_tags"
              :key="tag"
              style="margin-right: 5px"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>

          <!-- 这里是用户成绩的展示 -->
          <el-form-item label="成绩" prop="my_grades">
            <el-table :data="form.my_grades" style="width: 100%" height="250">
              <el-table-column
                prop="time"
                label="完成时间"
                sortable
                min-width="180"
                align="center"
              />
              <el-table-column
                prop="score"
                label="分数"
                sortable
                min-width="180"
                align="center"
              />
            </el-table>
          </el-form-item>
        </el-main>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, watch } from "vue";

const formRef = ref(null);
const form = ref({
  // 初始化表单数据
  mobile: "",
  avatarUrl: "",
  nickname: "",
  backdrop: "",
  status: "",
  signature: "",
  my_tags: [],
  my_grades: [],
});

const props = defineProps({
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogTableValue: {
    type: Object,
    default: () => {},
  },
});

watch(
  () => props.dialogTableValue,
  (newValue) => {
    if (newValue) {
      form.value = { ...newValue };
    }
  },
  { deep: true, immediate: true }
);
const emits = defineEmits(["update:modelValue", "initUserList"]);
const handleClose = () => {
  emits("update:modelValue", false);
};
</script>
    
    <style scoped></style>
    