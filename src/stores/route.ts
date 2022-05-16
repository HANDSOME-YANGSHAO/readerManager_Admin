import { defineStore } from 'pinia'

// Pinia 的 生命周期此时和sessionStorage保持一致，关闭浏览器生命周期就结束。
export const useRouteStore = defineStore({
  // 这个为必填项
  id: 'route',
  // state用箭头函数的原因：
  // 1；防止ssr渲染那边造成环境污染
  // 2: 更好的支持Typescript类型判断
  state: () => {
    return {
      userInfo: null,
      menuList: null
    }
  },
  actions: {
    setUserInfo (userInfo = null) { // 初始化用户信息
      if (userInfo) {
        this.userInfo = userInfo
        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
      }
    },
    setMenuList () { // 根据用户角色获取不同的菜单列表
      // 普通管理员
      if (this.userInfo && this.userInfo.role === '3') {
        this.menuList = [
          {
            path: '/infoManage',
            title: '信息管理',
            index: '1',
            child: [
              {
                path: '/infoManage/userManage',
                title: '人员管理',
                index: '1-1'
              },
              {
                path: '/infoManage/classManage',
                title: '班级管理',
                index: '1-2'
              }
            ]
          },
          {
            path: '/bookMange',
            title: '书籍管理',
            index: '2',
            child: [
              {
                path: '/bookMange/bookshelf',
                title: '书架',
                index: '2-1'
              },
              {
                path: '/bookMange/chapterManage',
                title: '目录管理',
                index: '2-2'
              }
            ]
          }
        ]
      }
      // 超级管理员
      if (this.userInfo && this.userInfo.role === '4') {
        this.menuList = [
          {
            path: '/infoManage',
            title: '信息管理',
            index: '1',
            child: [
              {
                path: '/infoManage/userManage',
                title: '人员管理',
                index: '1-1'
              },
              {
                path: '/infoManage/classManage',
                title: '班级管理',
                index: '1-2'
              },
              {
                path: '/infoManage/adminManage',
                title: '管理员',
                index: '1-3'
              }
            ]
          },
          {
            path: '/bookMange',
            title: '书籍管理',
            index: '2',
            child: [
              {
                path: '/bookManage/bookshelf',
                title: '书架',
                index: '2-1'
              },
              {
                path: '/bookManage/chapterManage',
                title: '目录管理',
                index: '2-2'
              }
            ]
          }
        ]
      }
    }
  },
  getters: {
    getMenuList () {
      return this.menuList
    },
    getUserInfo () {
      return this.userInfo
    }
  }
})
