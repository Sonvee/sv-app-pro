'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const AppReleaseSchema = new mongoose.Schema(
    {
      // 主键 - id
      release_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        unique: true,
        required: true
      },
      // 版本号 num.num.num.xxx
      version: {
        type: String,
        required: true
      },
      // 应用名称
      name: {
        type: String
      },
      // 应用类型 android ios mpweixin ...
      type: {
        type: String,
        required: true
      },
      // 资源文件
      file: {
        type: Object
      },
      // 资源链接，部分平台可能需要使用外链而非资源文件
      link: {
        type: String
      },
      // 版本描述
      description: {
        type: String
      },
      // 应用码地址
      qrcode: {
        type: String
      },
      // 应用简介
      intro: {
        type: String
      },
      // 应用截图
      screenshot: {
        type: Array
      },
      // 是否强制更新
      mandatory: {
        type: Boolean,
        default: false
      },
      // 更新内容
      upgrade: {
        type: String
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
