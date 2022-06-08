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

/**
 * @description: 导入excel
 * @param {*} data
 * @return {*}
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put', // 全量修改
    data
  })
}
