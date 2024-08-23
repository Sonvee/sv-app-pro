'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const AppHelpSchema = new mongoose.Schema(
    {
      // 主键 - id
      help_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        unique: true,
        required: true
      },
      // 帮助的名称/标题
      name: {
        type: String,
        required: true
      },
      // 序号
      sort: {
        type: Number
      },
      // 类型 例如：0热门问题 1账号相关 ...（由字典决定）
      type: {
        type: Number,
        required: true
      },
      // 内容
      content: {
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

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('app_help', AppHelpSchema)
}
