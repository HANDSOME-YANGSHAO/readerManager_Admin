<template>
  <el-header>
    <div class="logo_box">
      <img src="../../../assets/book.png" />
      <span>课外阅读后台管理系统</span>
    </div>
    <el-button @click="logout">退出</el-button>
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const logout = () => {
  window.sessionStorage.clear()
  ElMessage({
    message: '退出登陆',
    type: 'success'
  })
  router.push('/login')
}
</script>

<style scoped lang="scss">
.el-header {
  width: 100%;
  background-color: #1296db;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    width: 70%;
    display: flex;
    align-items: center;
    img {
      margin-left: 20PX;
      height: 50px;
      width: 50px;
      border-radius: 50%;
    }
    span {
      width: 500px;
      padding-left: 120px;
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
