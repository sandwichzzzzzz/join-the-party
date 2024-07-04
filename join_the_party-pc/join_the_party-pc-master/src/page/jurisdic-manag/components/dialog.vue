<template>
  <el-dialog :title="dialogTitle" width="40%" :before-close="handleClose">
    <el-form :model="form" label-width="70px" :rules="rules">
      <el-form-item label="学院" prop="college">
        <el-input v-model="form.college" />
      </el-form-item>

      <el-form-item label="工号" prop="adminNumber">
        <el-input v-model="form.adminNumber" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
  <script setup>
import { defineEmits, ref, defineProps, watch } from "vue";
import request from "@/api/request.js";
// import { addUsers, editUsers } from "@/api/dataRequest/users";
import { ElMessage } from "element-plus";
const form = ref({
  college: "",
  adminNumber: "",
});

//校验规则
const rules = ref({
  college: [
    {
      required: true,
      message: "请输入学院",
      trigger: "blur",
    },
  ],
  adminNumber: [
    {
      required: true,
      message: "请输入工号",
      trigger: "blur",
    },
  ],
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
  () => {
    form.value = props.dialogTableValue;
  },
  { deep: true, immediate: true }
);

const emits = defineEmits(["update:modelValue", "initUserList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};
const handleConfirm = async () => {
  await request.post("/setup-college-login", {
    college: form.value.college,
    adminNumber: form.value.adminNumber,
  });
  ElMessage({
    message: "更新成功",
    type: "success",
  });
  emits("initUserList");
  handleClose();
};
</script>
  
  <style scoped></style>
  