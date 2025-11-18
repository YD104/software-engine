import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../utils/api'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'))
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const router = useRouter()

  const isLoggedIn = computed(() => !!token.value)

  const login = async (username, password) => {
    try {
      const response = await api.login({ username, password })
      
      if (response.data.success) {
        token.value = response.data.access_token
        userInfo.value = response.data.user_info
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error_message || '登录失败' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.register(userData)
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error_message || '注册失败' 
      }
    }
  }

  const refreshToken = async () => {
    try {
      const response = await api.refreshToken()
      if (response.data.success) {
        token.value = response.data.access_token
        localStorage.setItem('token', token.value)
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile()
      if (response.data.success) {
        userInfo.value = response.data.user_info
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        return userInfo.value
      }
    } catch (error) {
      console.error('Fetch profile failed:', error)
      return null
    }
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    register,
    refreshToken,
    fetchProfile,
    logout
  }
})