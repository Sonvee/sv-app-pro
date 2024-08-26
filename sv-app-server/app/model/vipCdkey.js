'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const VipCdkeySchema = new mongoose.Schema(
    {
      // 主键 - 激活码
      cdkey: {
        type: String,
        unique: true,
        required: true,
      },
      // 激活码对应的会员套餐id
      cdkey_plan: {
        type: String,
      },
      // 激活码描述
      description: {
        type: String,
      },
      // 激活码有效期至
      valid_date: {
        type: Number,
      },
      // 状态：0-待使用，1-已使用，2-已失效(激活码已过期或绑定的套餐不存在)
      status: {
        type: Number,
        default: 0,
      },
      // 自动生成字段
      created_date: {
        type: Number,
      },
      updated_date: {
        type: Number,
      },
    },
    {
      versionKey: false, // 去除版本号字段
      timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
    }
  );

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('vip_cdkey', VipCdkeySchema);
};
