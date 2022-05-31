import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data: data
  })
}

// 获取用户信息
export function getProfile() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

// 获取用户头像
export function getUserDetailById(id) {
  return request({
    method: 'get',
    url: '/sys/user/' + id
  })
}

export function getInfo(token) {
  return request({

  })
}

export function logout() {
  return request({

  })
}
