'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const VipSubscriptionSchema = new mongoose.Schema(
    {
      // 主键 - 订阅单号
      subscription_id: {
        type: String,
        unique: true,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      // 订阅绑定的套餐
      subscription_plan: {
        type: String,
        required: true
      },
      // 用户id
      user_id: {
        type: String,
        required: true
      },
      // 订阅日期（时间戳 毫秒，并不一定代表从此刻开始计时）
      subscription_date: {
        type: Number
      },
      // 生效日期
      start_date: {
        type: Number
      },
      // 订阅持续时长 (毫秒)
      duration_time: {
        type: Number
      },
      // 订阅状态 0-待生效 1-生效中 2-已失效 3-待付款 4-付款中
      status: {
        type: Number,
        default: 0
      },
      // 订阅类型 0-普通支付，1-激活码
      type: {
        type: Number,
        default: 0
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
  return mongoose.model('vip_subscription', VipSubscriptionSchema)
}
