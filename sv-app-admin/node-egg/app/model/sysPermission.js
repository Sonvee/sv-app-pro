'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysPermissionSchema = new mongoose.Schema(
    {
      permission_id: {
        type: String,
        unique: true,
        required: true
      },
      permission_name: {
        type: String,
        required: true
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

  return mongoose.model('sys_permission', SysPermissionSchema)
}
