<template>
  <el-breadcrumb separator="/" id="content-title">
    <el-breadcrumb-item
      v-for="(item, index) in pagData"
      :key="index"
      :to="{ path: item.router }"
    >
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { defineProps } from "vue";
const { pagData } = defineProps(["pagData"]);
</script>

<style scoped>
</style>
