// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // 线上的地址
  // baseURL: 'http://ihrm-java.itheima.net'
  // baseURL: 'http://localhost:3000'
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (!response.data.success) {
    return Promise.reject(new Error(response.data.message))
  } else {
    // 为了解决代码冗余 因为每次请求数据的时候 都会有个 data 包裹着, 所以添加一个响应拦截, 每次回来的都会剥掉这层壳
    return response.data
  }
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    // 如果当前存有token,就加在请求头上
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }
  , error => {
    return Promise.reject(error)
  })

service.interceptors.response.use() // 响应拦截器
export default service // 导出axios实例

