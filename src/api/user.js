import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data: data
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
