import { constantRoutes } from '@/router'
// 获取路由的接口方法
import { getRoutes } from '@/api/role'
import Layout from '@/layout'

// 映射路由表
const componentsMap = {
  '/views/dashboard/index': () => import('@/views/dashboard/index')
}

export function getAsyncRoutes(routes) {
  const res = []
  const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
  routes.forEach(item => {
    const newItem = {}
    if (item.component && item.component === 'Layout') {
      newItem.component = Layout
    } else {
      if (componentsMap[item.component]) {
        newItem['component'] = componentsMap[item.component]
      } else {
        newItem['component'] = item.component
      }
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    if (newItem.children) {
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })
  debugger
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 路由访问
    state.addRoutes = routes
    // 菜单显示
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async reslove => {
      // 获取后端路由
      const routes = await getRoutes()
      // 对路由各式进行处理
      // const asyncRoutes = getAsyncRoutes(routes.data)
      const asyncRoutes = getAsyncRoutes(routes)
      debugger
      commit('SET_ROUTES', asyncRoutes)
      reslove(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
