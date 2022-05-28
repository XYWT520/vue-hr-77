// 导入 ajax 的请求
import { login } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    updataToken(state, payload) {
      state.token = payload

      // 把 token 存储到本地
      setToken(payload)
    }
  },
  actions: {
    async userLogin(context, payload) {
      const res = await login(payload)

      context.commit('updataToken', res.data)

      return res
    }
  },
  getters: {}
}
