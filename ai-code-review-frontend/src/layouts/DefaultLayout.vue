<template>
  <div class="layout">
    <el-header class="header">
      <div class="header-content">
        <h1 class="title">
          <i class="el-icon-cpu"></i>
          AI 代码审查系统
        </h1>
        <div class="user-info" v-if="userStore.isLoggedIn">
          <span>欢迎，{{ userStore.userInfo?.username }}</span>
          <el-button type="text" @click="handleLogout">退出</el-button>
        </div>
      </div>
    </el-header>
    
    <el-main class="main-content">
      <router-view />
    </el-main>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}

.title i {
  margin-right: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 60px);
}
</style>