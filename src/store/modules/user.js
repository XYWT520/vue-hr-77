// 导入 ajax 的请求
import { login, getProfile, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 把 token 存储到本地
    updataToken(state, payload) {
      state.token = payload
      // 把 token 存储到本地
      setToken(payload)
    },

    // 删除token
    remoeToken(state) {
      // vuex 中的 token 删除之后,本地的 token 也要删除
      state.token = ''
      removeToken()
    },

    // 存储用户信息
    updateUserInfo(state, payload) {
      state.userInfo = payload
    },

    // 删除用户信息
    remoevuserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async userLogin(context, payload) {
      const res = await login(payload)

      context.commit('updataToken', res.data)

      return res
    },

    // 这里调用 api 里面的请求 获取用户信息
    async getUserProfile(context) {
      const res = await getProfile()

      const res1 = await getUserDetailById(res.data.userId)

      // 这里是把数据传递给 mutations 的语法 context.commit()
      context.commit('updateUserInfo', { ...res.data, ...res1.data })
    },

    // 退出  这里封装一个退出的函数 以后要退出是 直接调用即可
    logout(context) {
      context.commit('remoeToken')
      context.commit('remoevuserInfo')
    }
  },
  getters: {}
}
