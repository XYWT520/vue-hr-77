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

// 删除员工
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: '/sys/user/' + id
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
