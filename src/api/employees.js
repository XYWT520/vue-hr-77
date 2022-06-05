import request from '@/utils/request'

// 查询企业的部门列表
export function getSimple() {
  return request({
    method: 'get',
    url: '/sys/user/simple'
  })
}

// 获取员工列表
export function getEmployees(params) {
  return request({
    method: 'get',
    url: '/sys/user/',
    params
  })
}
