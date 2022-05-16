<template>
  <el-container class="content-container">
    <div class="aside">
      <el-menu :default-active="activePath" class="el-menu-vertical-demo" router>
        <el-sub-menu v-for="item in menuList" :key="item.index" :index="item.path">
          <template #title>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="childItem in item.child"
            :key="childItem.index"
            :index="childItem.path"
            >{{ childItem.title }}</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </div>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouteStore } from '@/stores/route'

// 刷新时，获取缓存的路由激活状态
const activePath = ref(window.sessionStorage.getItem('activePath'))

const routeStore = useRouteStore()

const menuList = reactive(routeStore.getMenuList)
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.content-container {
  width: 100%;
}
.aside {
  height: calc(100vh - 60px);
  .el-menu {
    height: 100%;
  }
}
.el-main {
  width: calc(100vw - 200px);
  height: calc(100vh - 60px);
  background-color: rgb(246, 246, 246);
}
</style>
