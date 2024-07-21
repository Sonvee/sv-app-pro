'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysRoleSchema = new mongoose.Schema(
    {
      role_id: {
        type: String,
        unique: true,
        required: true
      },
      role_name: {
        type: String,
        required: true
      },
      permissions: {
        type: Array
      },
      status: {
        type: Number,
        default: 1
      },
      sort: {
        type: Number,
        default: 0
      },
      remark: {
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

  return mongoose.model('sys_role', SysRoleSchema)
}
