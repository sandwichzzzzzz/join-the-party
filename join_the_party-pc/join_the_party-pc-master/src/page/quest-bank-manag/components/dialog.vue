<template>
  <el-dialog :title="dialogTitle" width="60%" :before-close="handleClose">
    <el-form :model="form" label-width="70px" :rules="rules">
      <el-form-item label="题目" prop="ExamQuestion">
        <el-input v-model="form.ExamQuestion" type="textarea" />
      </el-form-item>

      <el-form-item label="题型" prop="type">
        <el-select
          v-model="qunestionType"
          :placeholder="form.type"
          class="m-2"
          size="large"
          @change="changeType"
        >
          <el-option
            v-for="item in qType"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选项" v-for="item in form.options">
        <el-input v-model="item.select" />

        <el-checkbox
          v-model="item.isCorrect"
          :placeholder="form.type"
          label="正确答案"
          border
          @change="changeAnswered(item.isCorrect, item.select_id)"
        />
      </el-form-item>

      <el-form-item label="解析" prop="analyze">
        <el-input
          input-style="height:100px;"
          v-model="form.analyze"
          type="textarea"
        />
      </el-form-item>

      <el-form-item
        label="图片"
        prop="image"
        v-if="props.dialogTitle != '添加题目'"
      >
        <el-image
          style="width: 300px; height: 200px"
          :z-index="999999"
          :src="form.picture"
          fit="contain"
          :preview-src-list="[form.picture]"
          :preview-teleported="true"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item
        label="图片"
        prop="picture"
        v-if="props.dialogTitle == '添加题目'"
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
import { defineEmits, ref, defineProps, watch, onMounted, reactive } from "vue";
import request from "@/api/request.js";
import { ElMessage } from "element-plus";
import { imageUrl } from "@/api/request.js";
import { Picture as IconPicture } from "@element-plus/icons-vue";

const qType = ref(["单选题", "多选题"]);
const qunestionType = ref("");
let form = reactive({
  ExamQuestion: "",
  type: "",
  analyze: "",
  picture: "",
  correct_id: [],
});

const initializeForm = () => {
  if (props.dialogTitle === "添加题目") {
    // 重置基础字段
    form.ExamQuestion = "";
    form.type = "";
    form.analyze = "";
    form.picture = "";
    form.correct_id = [];
  }
};

onMounted(() => {
  initializeForm();
  assignSelectIds();
});

//判断是否为空的函数
const isNull = (data) => {
  if (!data) return true;
  if (JSON.stringify(data) === "{}") return true;
  if (JSON.stringify(data) === "[]") return true;
};

//添加控制正确答案属性
const assignSelectIds = () => {
  if (!isNull(form.options)) {
    form.options = form.options.map((option) => ({
      ...option,
      isCorrect: false,
    }));
    form.options.forEach((option) => {
      // 检查 select_id 是否存在于 correct_id 中
      option.isCorrect = form.correct_id.includes(option.select_id);
    });
  } else {
    form.options = [
      { select: "", select_id: "", isCorrect: false },
      { select: "", select_id: "", isCorrect: false },
      { select: "", select_id: "", isCorrect: false },
      { select: "", select_id: "", isCorrect: false },
    ];

    form.options.forEach(function (element) {
      element.select_id = Math.random().toString(16).slice(2);
    });
    form.correct_id = [];
  }
};

//设置为正确答案
const changeAnswered = (change, id) => {
  if (change) {
    form.correct_id.push(id);
  } else {
    form.correct_id = form.correct_id.filter((item) => item !== id);
  }
};

//更改题型
const changeType = () => {
  if (qunestionType.value == "单选题") {
    form.type = "101";
  } else {
    form.type = "102";
  }
};

const rules = ref({
  ExamQuestion: [
    {
      required: true,
      message: "请输入题目",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择题型",
      trigger: "blur",
    },
  ],
  analyze: [
    {
      required: true,
      message: "请输入解析",
      trigger: "blur",
    },
  ],
  options: [
    {
      required: true,
      message: "请添加选项",
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
});

watch(
  () => props.dialogTableValue,
  (newValue) => {
    Object.assign(form, newValue); // 使用 Object.assign 或者 {...展开运算符}
  },
  { deep: true, immediate: true }
);

const emits = defineEmits(["update:modelValue", "initUserList"]);

//图片&&视频上传
const handleAvatarSuccess = (response, file, fileList) => {
  if (response.msg === "SUCCESS") {
    form.picture = response.data[0];
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
//关闭对话框
const handleClose = () => {
  emits("update:modelValue", false);
};
const handleConfirm = async () => {
  props.dialogTitle === "添加题目"
    ? await request.post("/addQuestion", form)
    : await request.post("/changeQuestion", form);
  ElMessage({
    message: "更新成功",
    type: "success",
  });
  emits("initUserList");
  handleClose();
};
</script>
<style scoped>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>