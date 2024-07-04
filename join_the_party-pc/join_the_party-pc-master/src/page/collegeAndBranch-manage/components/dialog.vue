<template>
  <el-dialog :title="dialogTitle" width="40%" :before-close="handleClose">
    <el-form :model="form" label-width="100px" :rules="rules">
      <el-form-item
        label="学院"
        prop="college"
        v-if="props.dialogTitle == '添加学院'"
      >
        <el-input v-model="form.college" />
      </el-form-item>
      <el-form-item
        label="党支部"
        prop="branch"
        v-if="props.dialogTitle != '添加学院'"
      >
        <el-input v-model="form.branch" />
      </el-form-item>
      <el-form-item
        label="封面"
        prop="image"
        v-if="props.dialogTitle != '添加学院'"
      >
        <el-upload
          class="upload-demo"
          :action="imageUrl"
          :on-success="handleAvatarSuccess"
          list-type="picture"
          :limit="1"
        >
          <el-button type="primary">点击上传图片</el-button>
          <template #tip>
            <div class="el-upload__tip">图片文件应小于500kb</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="党支部介绍"
        prop="branchIntroduction"
        v-if="props.dialogTitle != '添加学院'"
      >
        <el-input v-model="form.branchIntroduction" />
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
import { imageUrl } from "@/api/request.js";
// import { addUsers, editUsers } from "@/api/dataRequest/users";
import { ElMessage } from "element-plus";
const form = ref({
  college: "",
  mobile: "",
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
  branch: [
    {
      required: true,
      message: "请输入党支部",
      trigger: "blur",
    },
  ],
  image: [
    {
      required: true,
      message: "请上传封面",
      trigger: "blur",
    },
  ],
  branchIntroduction: [
    {
      required: true,
      message: "请填写介绍",
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
  dialogType: {
    type: String,
    default: "",
    required: true,
  },
});

watch(
  () => props.dialogTableValue,
  () => {
    form.value = props.dialogTableValue;
  },
  { deep: true, immediate: true }
);

//图片&&视频上传
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.msg === "SUCCESS") {
    form.value.image = response.data[0];
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  } else {
    ElMessage({
      message: response.error,
      type: "error",
    });
  }
};

const emits = defineEmits([
  "update:modelValue",
  "initUserList",
  "initAdminsList",
]);

const handleClose = () => {
  emits("update:modelValue", false);
};
const handleConfirm = async () => {
  let res;

  if (props.dialogTitle == "添加学院") {
    res = await request.post("/addCollege", {
      college: form.value.college,
    });
  } else {
    res = await request.post("/addBranch", {
      type: props.dialogType,
      branch: form.value.branch,
      image: form.value.image,
      branchIntroduction: form.value.branchIntroduction,
    });
  }

  ElMessage({
    message: "更新成功",
    type: "success",
  });
  if (props.dialogTitle == "添加学院") {
    emits("initUserList");
  } else {
    emits("initAdminsList");
  }
  handleClose();
};
</script>
  
  <style scoped></style>
  