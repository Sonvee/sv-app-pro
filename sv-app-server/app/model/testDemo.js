'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const TestDemoSchema = new mongoose.Schema(
    {
      // 主键 - id
      test_id: {
        type: String,
        unique: true,
        required: true
      },
      test_name: {
        type: String
      },
      test_foreign_link: {
        type: String
      },
      test_foreigns: {
        type: Array
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

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('test_demo', TestDemoSchema)
}
