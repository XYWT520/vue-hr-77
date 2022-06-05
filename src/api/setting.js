// 导入axios实例
import request from '@/utils/request'

// 根据业务要求- 查接口文档-封装api
/**
 * 获取所有角色信息
 * @param {*} params  {page, pagesize}
 * @returns
 */
export function getRoles(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

/** 添加角色 */
export function addRoles(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/** 添删除角色 */
export function deleteRoles(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
