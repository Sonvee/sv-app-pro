'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const VipBenefitSchema = new mongoose.Schema(
    {
      // 主键 - id
      benefit_id: {
        type: String,
        unique: true,
        required: true,
      },
      // 权益名称
      benefit_name: {
        type: String,
      },
      // 权益描述
      description: {
        type: String,
      },
      // 权益图标
      icon: {
        type: String,
      },
      // 排序
      sort: {
        type: Number,
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
  return mongoose.model('vip_benefit', VipBenefitSchema);
};
