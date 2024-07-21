import request from '@/config/request'

/**
 * 查询 post - 权限 permission
 * @param {Object} data - 请求参数
 * @property {String} data._id - id
 * @property {String} data.log_type - 类型：login登录日志，operation操作日志
 * @property {Number} data.pagesize - 每页条数
 * @property {Number} data.pagenum - 页码
 */
export function logList(data) {
  return request({
    url: '/sys/logList',
    method: 'post',
    data
  })
}

/**
 * 删除 post - 权限 permission
 * @param {Object} data - 请求参数
 * @property {String} data._id - id
 */
export function logDelete(data) {
  return request({
    url: '/sys/logDelete',
    method: 'post',
    data
  })
}

/**
 * 批量删除 post - 权限 permission
 * @param {Object} data - 请求参数
 * @property {Array} data.list - 批量删除项
 */
export function logBatchDelete(data) {
  return request({
    url: '/sys/logBatchDelete',
    method: 'post',
    data
  })
}

/**
 * 清空 post - 权限 permission
 * @param {Object} data - 请求参数
 * @property {Array} data.log_type - 类型：login登录日志，operation操作日志
 */
export function logClear(data) {
  return request({
    url: '/sys/logClear',
    method: 'post',
    data
  })
}
