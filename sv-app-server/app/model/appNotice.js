'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const AppNoticeSchema = new mongoose.Schema(
    {
      notice_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        unique: true,
        required: true
      },
      notice_name: {
        type: String
      },
      notice_title: {
        type: String
      },
      // 内容：富文本格式
      notice_content: {
        type: String
      },
      // 通知公告类型：0通知 1公告
      notice_type: {
        type: Number
      },
      remark: {
        type: String
      },
      status: {
        type: Number,
        default: 1
      },
      // 公布时间范围：[起始时间戳, 结束时间戳]
      publish_timerange: {
        type: Array
      },
      // 是否置顶
      top: {
        type: Boolean
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

  return mongoose.model('app_notice', AppNoticeSchema)
}
