'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const AppFeedbackSchema = new mongoose.Schema(
    {
      // 建议自动生成唯一id，可由前缀+类型+用户+时间戳组合
      feedback_id: {
        type: String,
        unique: true,
        required: true
      },
      // 名称
      name: {
        type: String
      },
      // 标题
      title: {
        type: String
      },
      // 类型：0待解决 1已解决
      type: {
        type: Number,
        default: 0
      },
      // 反馈内容
      content: {
        type: String
      },
      // 回复
      reply: {
        type: String
      },
      // 状态：由字典自定义
      status: {
        type: Number,
        required: true
      },
      // 备注
      remark: {
        type: String
      },
      // 创建者
      created_by: {
        type: Object
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

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('app_feedback', AppFeedbackSchema)
}
