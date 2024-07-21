'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const TestForeignSchema = new mongoose.Schema(
    {
      testforeign_id: {
        type: String,
        unique: true,
        required: true
      },
      testforeign_name: {
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

  return mongoose.model('test_foreign', TestForeignSchema)
}
