'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysDictSchema = new mongoose.Schema(
    {
      // 字典id
      dict_id: {
        type: String,
        unique: true,
        required: true
      },
      dict_name: {
        type: String
      },
      remark: {
        type: String
      },
      sort: {
        type: Number,
        default: 0
      },
      status: {
        type: Number,
        default: 1
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

  return mongoose.model('sys_dict', SysDictSchema)
}
