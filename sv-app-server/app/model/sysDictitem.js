'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysDictitemSchema = new mongoose.Schema(
    {
      // 字典项id
      dictitem_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        unique: true,
        required: true
      },
      // 字典类型，对应dict_id
      dict_type: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      value: {
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
      // 行为样式：default(空),primary,success,info,warning,danger
      action_style: {
        type: String,
        default: ''
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

  return mongoose.model('sys_dictitem', SysDictitemSchema)
}
