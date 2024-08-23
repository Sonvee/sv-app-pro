'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const VipPlanSchema = new mongoose.Schema(
    {
      // 主键 - 套餐id
      plan_id: {
        type: String,
        unique: true,
        required: true
      },
      // 套餐名称
      plan_name: {
        type: String
      },
      // 套餐描述
      description: {
        type: String
      },
      // 套餐价格 (分)
      price: {
        type: Number
      },
      // 套餐折扣 (分)
      discount: {
        type: Number
      },
      // 套餐有效期（天）
      valid_day: {
        type: Number
      },
      // vip权益列表，参考vip_benefits表
      benefits: {
        type: Array
      },
      // 排序
      sort: {
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

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('vip_plan', VipPlanSchema)
}
