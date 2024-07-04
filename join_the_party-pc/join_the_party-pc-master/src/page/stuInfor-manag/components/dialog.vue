<template>
  <el-dialog :title="dialogTitle" width="60%" :before-close="handleClose">
    <el-form fef="formRef" :model="form" label-width="70px">
      <el-container>
        <el-aside width="250px">
          <el-form-item label="学生照片" prop="avatarUrl"
            ><el-image
              style="width: 250px; height: 250px"
              :src="form.avatarUrl"
              lazy
              fit="contain"
            /> </el-form-item
        ></el-aside>

        <el-main>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="form.username" disabled />
          </el-form-item>

          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" disabled />
          </el-form-item>
          <el-form-item label="班级" prop="class">
            <el-input v-model="form.class" disabled />
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="form.studentId" disabled />
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-input v-model="form.nation" disabled />
          </el-form-item>
          <el-form-item label="党员类型" prop="partyMembrtType">
            <el-input v-model="form.status" disabled />
          </el-form-item>
          <el-form-item label="学院" prop="college">
            <el-input v-model="form.college" disabled />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" disabled />
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" disabled />
          </el-form-item>

          <el-form-item label="培养老师" prop="teacher_one">
            <el-input v-model="form.teacher_one" disabled /> </el-form-item
        ></el-main>
      </el-container>
    </el-form>

    <form :data="tableData" style="padding: 0 30px">
      <el-form-item label="审核材料：">
        <!-- 选择器 -->
        <el-select
          v-model="currentCiLiao"
          class="m-2"
          size="large"
          style="width: 20%"
        >
          <el-option
            v-for="item in colleges"
            :key="item"
            :label="item"
            :value="item"
            @click="filterCaiLiao(currentCiLiao)"
          />
        </el-select>
      </el-form-item>

      <el-carousel
        :interval="5000"
        arrow="always"
        style="padding-bottom: 30px; height: 600px"
      >
        <el-carousel-item
          v-for="item in showTable"
          :key="item"
          style="height: 600px"
        >
          <h3>{{ item.label }}</h3>
          <el-image
            :z-index="999999"
            :src="item.value"
            fit="contain"
            :preview-src-list="previewList"
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

      <el-form-item label="审核情况">
        <el-input
          :value="getAuditStatus(tableData.ispass)"
          disabled
          style="width: 20%"
        />
      </el-form-item>
      <!-- <el-text size="large">:</el-text> -->
      <el-form-item label="评语">
        <el-input disabled v-model="tableData.evaluate" type="textarea" />
      </el-form-item>
    </form>
  </el-dialog>
</template>
    
    <script setup>
import { defineEmits, ref, defineProps, watch, onMounted } from "vue";
import request from "@/api/request.js";
import { optionsCaiLiao } from "../options-cailiao.js";
import { Picture as IconPicture } from "@element-plus/icons-vue";

const form = ref({
  username: "",
  age: "",
  class: "",
  studentId: "",
  nation: "",
  avatarUrl: [],
});

const colleges = ref(["材料一", "材料二", "材料三", "材料四"]);
const currentCiLiao = ref("材料一");
const tableData = ref([]);
const baseTableData = ref([]);
const showTable = ref([]);
const previewList = ref([]);

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

//判断是否为空函数
const isNull = (data) => {
  return (
    !data || JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]"
  );
};

requestApi();
async function requestApi() {
  const res = await request.get("/getPartyData-pc", {
    student_id: "660220e89df65aba4b8c62ca",
  });
  if (isNull(res)) {
    ElMessage.error("获取数据为空");
  } else {
    baseTableData.value = res.data[0];
  }
  filterCaiLiao(currentCiLiao.value);
}

const filterCaiLiao = (CaiLiao) => {
  showTable.value = [];
  // 创建一个新对象来存储过滤后的数据
  let filteredData = {};
  // 根据不同的 CaiLiao 值选择不同的前缀
  let prefix;
  if (CaiLiao === "材料一") {
    prefix = "one_";
  } else if (CaiLiao === "材料二") {
    prefix = "two_";
  } else if (CaiLiao === "材料三") {
    prefix = "thr_";
  } else if (CaiLiao === "材料四") {
    prefix = "for_";
  }
  // 遍历 tableData 对象的属性
  for (const key in baseTableData.value) {
    // 检查属性是否以指定的前缀开头
    if (key.startsWith(prefix)) {
      // 将满足条件的属性添加到 filteredData 对象中
      filteredData[key] = baseTableData.value[key];
    }

    if (key.endsWith(prefix + "evaluate")) {
      filteredData.evaluate = baseTableData.value[key];
    }
    if (key.endsWith(prefix + "ispass")) {
      filteredData.ispass = baseTableData.value[key];
    }
  }

  tableData.value = filteredData;
  for (const prop in tableData.value) {
    const foundItem = optionsCaiLiao.find((item) => item.prop === prop);
    if (foundItem) {
      if (Array.isArray(tableData.value[prop])) {
        // tableData.value[prop] 是一个数组，遍历它
        tableData.value[prop].forEach((arrayItem) => {
          showTable.value.push({
            prop: prop,
            label: foundItem.label,
            value: arrayItem,
          });
        });
      } else {
        // tableData.value[prop] 不是一个数组，直接赋值
        showTable.value.push({
          prop: prop,
          label: foundItem.label,
          value: tableData.value[prop],
        });
      }
    }
  }

  showTable.value.forEach((item) => {
    previewList.value.push(item.value);
  });
};
const getAuditStatus = (ispass) => {
  if (ispass === 0) {
    return "未审核";
  } else if (ispass === 1) {
    return "审核不通过";
  } else if (ispass === 2) {
    return "审核已通过";
  } else {
    return "未知状态"; // 可以在这里定义一个默认状态，以防出现意外的值
  }
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
.image-slot .el-icon {
  font-size: 30px;
}
</style>
    