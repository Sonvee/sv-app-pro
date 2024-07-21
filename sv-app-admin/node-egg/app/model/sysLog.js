'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysLogSchema = new mongoose.Schema(
    {
      // 日志类型：login登录日志，operation操作日志
      log_type: {
        type: String,
        required: true
      },
      // 操作人员信息
      operator_info: {
        type: Object
      },
      // IP地址
      operator_ip: {
        type: String
      },
      // 地理位置
      operator_location: {
        type: String
      },
      // 请求相关
      request_method: {
        type: String
      },
      request_url: {
        type: String
      },
      request_status: {
        type: Number
      },
      request_msg: {
        type: String
      },
      request_err: {
        type: Object
      },
      request_params: {
        type: Object
      },
      // 消耗时长（毫秒）
      costtime: {
        type: Number
      },
      // User-Agent
      userAgent: {
        type: Object
      },
      // 登录方式，仅登录日志
      login_type: {
        type: String
      },
      // 以下参数暂时用不到
      created_by: {
        type: String
      },
      updated_by: {
        type: String
      },
      // 自动生成字段
      created_date: {
        type: Number
      },
      updated_date: {
        type: Number
      }
    },
    {
      versionKey: false, // 去除版本号字段
      timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
    }
  )

  return mongoose.model('sys_log', SysLogSchema)
}
