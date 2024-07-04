<template>
  <el-dialog :title="dialogTitle" width="50%" :before-close="handleClose">
    <el-form fef="formRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="标题" prop="newTitle">
        <el-input v-model="form.newTitle" />
      </el-form-item>

      <el-form-item label="出处" prop="source">
        <el-input v-model="form.source" />
      </el-form-item>
      <el-form-item label="时间" prop="newTime">
        <el-date-picker
          type="date"
          placeholder="选择时间"
          clearable
          v-model="form.newTime"
        />
      </el-form-item>
      <!-- 上传图片 -->
      <el-form-item label="作者" prop="writer">
        <el-input v-model="form.writer" />
      </el-form-item>

      <el-form-item label="图片" prop="image" v-if="dialogIsIamg">
        <el-carousel
          :interval="5000"
          arrow="always"
          style="width: 400px; height: 300px"
        >
          <el-carousel-item
            v-for="item in form.image"
            :key="item"
            style="height: 600px"
          >
            <el-image
              :z-index="999999"
              :src="item"
              fit="contain"
              :preview-src-list="form.image"
              :preview-teleported="true"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>

      <el-form-item label="上传图片" prop="image" v-if="dialogIsIamg">
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
      <!-- 上传视频 -->
      <el-form-item label="视频" prop="vdieo" v-if="!dialogIsIamg">
        <el-upload
          class="upload-demo"
          :before-upload="getFile"
          action=""
          :on-success="handleAvatarSuccess"
          :http-request="upload"
        >
          <el-button type="primary">点击上传视频</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="封面" prop="videoPoster" v-if="!dialogIsIamg">
        <el-upload
          class="upload-demo"
          :action="imageUrl"
          :on-success="handleAvatarSuccess"
          list-type="picture"
        >
          <el-button type="primary">点击上传封面</el-button>
          <template #tip>
            <div class="el-upload__tip">图片文件应小于500kb</div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="内容" prop="newContent">
        <el-input
          input-style="height:150px;"
          v-model="form.newContent"
          type="textarea"
        />
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
import { Picture as IconPicture } from "@element-plus/icons-vue";

const initializeForm = () => {
  if (props.dialogTitle === "添加咨询") {
    form.value = {
      newTitle: "",
      newContent: "",
      newTime: "",
      source: "",
      writer: "",
      image: [],
    };
  }
};

onMounted(() => {
  initializeForm();
});

const form = ref({
  newTitle: "",
  newContent: "",
  newTime: "",
  source: "",
  writer: "",
  image: [],
});
//校验规则
const rules = ref({
  newTitle: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
  ],
  newContent: [
    {
      required: true,
      message: "请输入内容",
      trigger: "blur",
    },
  ],
  newTime: [
    {
      required: true,
      message: "请选择时间",
      trigger: "blur",
    },
  ],
  source: [
    {
      required: true,
      message: "请输入出处",
      trigger: "blur",
    },
  ],
  writer: [
    {
      required: true,
      message: "请输入作者",
      trigger: "blur",
    },
  ],
  image: [
    {
      required: true,
      message: "请上传图片",
      trigger: "blur",
    },
  ],
  videoPoster: [
    {
      required: true,
      message: "请上传视频图片",
      trigger: "blur",
    },
  ],
  vdieo: [
    {
      required: true,
      message: "请上传视频",
      trigger: "blur",
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
  dialogIsIamg: {
    type: Boolean,
    default: "",
    required: true,
  },
});

//修改时间为字符串
const formatDateString = (date) => {
  if (typeof date === "string") {
    return date; // 如果是字符串，则不需要格式化，直接返回
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
  form.value.newTime = formatDateString(form.value.newTime);
  if (props.dialogTitle === "添加咨询") {
    if (props.dialogIsIamg) {
      await request.post("/addNew", form.value);
    } else {
      await request.post("/addNew-video", {
        newTitle: "学习强国",
        newContent:
          "中国航天事业起始于1956年，于1970年4月24日发射第一颗人造地球卫星，中国是继苏联、美国、法国、日本之后第5个能独立发射人造卫星的国家",
        newTime: "2023-2-22",
        source: "来源百度百科",
        writer: "未知",
        videoPoster:
          "https://yes-1317567548.cos.ap-nanjing.myqcloud.com/img%26vdo/houtaifengmian1.jpg",
        videoUrl:
          "https://yes-1317567548.cos.ap-nanjing.myqcloud.com/img%26vdo/qiangshengfangtan.mp4",
        videoWidth: 200,
        videoHeight: 300,
      });
    }
  } else {
    if (props.dialogIsIamg) {
      await request.post("/changeNew", form.value);
    } else {
      await request.post("/changeNewVideo", form.value);
    }
  }
  ElMessage({
    message: "更新成功",
    type: "success",
  });
  emits("initUserList");
  handleClose();
};

const File = ref();
const getFile = (param) => {
  File.value = param;
};

const upload = async () => {
  const formData = new FormData();
  formData.append("file", File.value);
  const url = "/imageUpload";
  await request.post(url, formData);
};

//图片&&视频上传
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.msg === "SUCCESS") {
    if (props.dialogIsIamg) {
      form.value.image.push(response.data[0]);
    } else {
      form.value.image.push(response.data[0]);
    }
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
    