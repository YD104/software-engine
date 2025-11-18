<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
  <!-- 暂时注释掉 SystemStatus -->
  <!-- <SystemStatus /> -->
</template>

<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
// import SystemStatus from './components/SystemStatus.vue' // 暂时注释
</script>