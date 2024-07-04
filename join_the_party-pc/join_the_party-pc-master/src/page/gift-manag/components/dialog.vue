<template>
  <el-dialog :title="dialogTitle" width="50%" :before-close="handleClose">
    <el-form fef="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="奖品名称" prop="giftTitle">
        <el-input v-model="form.giftTitle" />
      </el-form-item>

      <el-form-item label="奖品编号" prop="giftNumber">
        <el-input v-model="form.giftNumber" />
      </el-form-item>
      <!-- 上传图片 -->
      <el-form-item label="所需兑换积分" prop="giftScore">
        <el-input v-model="form.giftScore" />
      </el-form-item>
      <el-form-item label="奖品封面图" prop="giftPicture">
        <el-upload
          class="upload-demo"
          :action="imageUrl"
          :on-success="handleAvatarSuccess"
          list-type="picture"
        >
          <el-button type="primary">点击上传图片</el-button>
          <template #tip>
            <div class="el-upload__tip">图片文件应小于500kb</div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="奖品简介" prop="giftIntroduce">
        <el-input v-model="form.giftIntroduce" type="textarea" />
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
import { defineEmits, ref, defineProps, watch, onMounted } from "vue";
import request from "@/api/request.js";
// import { addUsers, editUsers } from "@/api/dataRequest/users";
import { ElMessage } from "element-plus";
import { imageUrl } from "@/api/request.js";

const initializeForm = () => {
  if (props.dialogTitle === "添加新奖品") {
    form.value = {
      giftNumber: "",
      giftTitle: "",
      giftIntroduce: "",
      giftPicture: "",
      giftScore: "",
    };
  }
};

onMounted(() => {
  initializeForm();
});

const form = ref({
  giftNumber: "",
  giftTitle: "",
  giftIntroduce: "",
  giftPicture: "",
  giftScore: "",
});
//校验规则
const rules = ref({
  giftTitle: [
    {
      required: true,
      message: "请输入奖品名称",
      trigger: "change",
    },
  ],
  giftNumber: [
    {
      required: true,
      message: "请输入奖品编号",
      trigger: "change",
    },
  ],
  giftPicture: [
    {
      required: true,
      message: "请选择奖品封面",
      trigger: "change",
    },
  ],
  giftIntroduce: [
    {
      required: true,
      message: "请输入奖品简介",
      trigger: "change",
    },
  ],
  giftScore: [
    {
      required: true,
      message: "请输入所需兑换积分",
      trigger: "change",
    },
  ],
});
//传值
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
//确认提交
const handleConfirm = async () => {
  await request.post("/changePost", form.value);
  ElMessage({
    message: "更新成功",
    type: "success",
  });
  emits("initUserList");
  handleClose();
};

//图片&&视频上传
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.msg === "SUCCESS") {
    form.value.giftPicture = response.data[0];
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
</script>
    
    <style scoped></style>
    