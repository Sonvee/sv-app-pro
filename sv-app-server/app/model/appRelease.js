'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const AppReleaseSchema = new mongoose.Schema(
    {
      // 版本号
      version: {
        type: String,
        unique: true,
        required: true
      },
      // 版本文件
      file: {
        type: Object,
        required: true
      },
      // 版本描述
      description: {
        type: String
      },
      // 是否强制更新
      mandatory: {
        type: Boolean,
        default: false
      },
      // 备注
      remark: {
        type: String
      },
      // 发布日期
      release_date: {
        type: Number
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

  return mongoose.model('app_release', AppReleaseSchema)
}
