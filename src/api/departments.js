import request from '@/utils/request'

// 查询企业的部门列表
export function getDepartments() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}

// 新增部门
export function setDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

// 获取部门详情 数据回填
export function getDepartDetail(id) {
  return request({
    method: 'get',
    url: '/company/department/' + id
  })
}

// 更新部门数据的接口
export function updateDepartDetail(data) {
  return request({
    method: 'put',
    url: '/company/department/' + data.id,
    data
  })
}

// 根据 id 删除部门
export function DeldepartDetail(id) {
  return request({
    method: 'delete',
    url: '/company/department/' + id
  })
}
