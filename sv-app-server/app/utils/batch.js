const batchSize = 1000 // 默认分批数量

/**
 * 批量新增
 * @param {Object} ctx
 * @param {Object} db - 数据库
 * @param {Object} data - 请求参数
 * @property {Array} data.list - 批量新增项
 * @property {Boolean} data.cover - 是否覆盖 默认false
 * @param {String} primaryKey - 主键
 * @param {Boolean} auto - 主键是否为自动生成键
 */
async function batchAdd(ctx, db, data, primaryKey, auto = false) {
  if (!auto) {
    // 过滤掉主键缺失无效的项
    data.list = data.list.filter((item) => item[primaryKey])
  }

  // 结果处理
  let res, tip
  if (data.cover) {
    // 覆盖模式：使用 upsert 更新或插入数据
    res = await Promise.all(
      data.list.map(async (item) => {
        try {
          return await db.findOneAndUpdate({ [primaryKey]: item[primaryKey] }, item, { upsert: true, new: true })
        } catch (error) {
          ctx.logger.warn(`Error updating or inserting item ${item[primaryKey]}:`, error)
          return null // 返回一个表示失败的特殊值
        }
      })
    )
  } else {
    // 增量模式：使用 insertMany 插入数据
    const existingIds = data.list.map((item) => item[primaryKey])
    const existingKeys = []

    // 分批处理，避免 $in 操作符中的元素过多，
    for (let i = 0; i < existingIds.length; i += batchSize) {
      const batchKeys = existingIds.slice(i, i + batchSize)
      const batchExistingItems = await db.find({ [primaryKey]: { $in: batchKeys } })
      existingKeys.push(...batchExistingItems.map((item) => item[primaryKey]))
    }

    if (existingKeys.length > 0) {
      tip = `已跳过存在项：${existingKeys.toString()}`
    }

    // 过滤掉已存在的记录
    const filteredItems = data.list.filter((item) => !existingKeys.includes(item[primaryKey]))

    try {
      res = await db.insertMany(filteredItems)
    } catch (error) {
      ctx.logger.error('Error during insertMany operation:', error)
      return ctx.throw(500, { msg: '服务器内部错误' })
    }
  }

  return { data: res, tip }
}

/**
 * 批量新增 - 特殊情况：主键自动生成，依靠另外两个副键相同确认数据是否重复
 * @param {Object} ctx
 * @param {Object} db - 数据库
 * @param {Object} data - 请求参数
 * @property {Array} data.list - 批量新增项
 * @property {Boolean} data.cover - 是否覆盖 默认false
 * @param {String} primaryKey - 主键
 * @param {String} secondaryKey - 副键
 * @param {String} tertiaryKey - 次键
 */
async function batchAddX(ctx, db, data, primaryKey, secondaryKey, tertiaryKey) {
  let existingTypes = [] // 记录所有副键

  // 结果处理
  let res, tip
  if (data.cover) {
    // 覆盖模式：使用 upsert 更新或插入数据
    res = await Promise.all(
      data.list.map(async (item) => {
        if (!existingTypes.includes(item[secondaryKey])) existingTypes.push(item[secondaryKey]) // 记录所有字典类型
        try {
          // 使用复合条件查询
          const query = { [secondaryKey]: item[secondaryKey], [tertiaryKey]: item[tertiaryKey] }
          return await db.findOneAndUpdate(query, item, { upsert: true, new: true })
        } catch (error) {
          ctx.logger.warn(`Error updating or inserting item ${item[secondaryKey]} and label: ${item[tertiaryKey]}:`, error)
          return null // 返回一个表示失败的特殊值
        }
      })
    )
  } else {
    // 增量模式：使用 insertMany 插入数据
    const existingIds = data.list.map((item) => {
      if (!existingTypes.includes(item[secondaryKey])) existingTypes.push(item[secondaryKey]) // 记录所有字典类型
      return item[primaryKey]
    })

    const existingKeys = []

    // 分批处理，避免 $in 操作符中的元素过多，
    for (let i = 0; i < existingIds.length; i += batchSize) {
      const batchKeys = existingIds.slice(i, i + batchSize)
      const batchExistingItems = await db.find({ [primaryKey]: { $in: batchKeys } })
      existingKeys.push(...batchExistingItems.map((item) => item[primaryKey]))
    }

    // 使用复合条件查询来找出已存在的项
    const existingItems = await db.find({
      [secondaryKey]: { $in: data.list.map((item) => item[secondaryKey]) },
      [tertiaryKey]: { $in: data.list.map((item) => item[tertiaryKey]) }
    })

    const existingLabels = existingItems.map((item) => `${item[secondaryKey]}:${item[tertiaryKey]}`)

    if (existingLabels.length > 0) {
      tip = `已跳过存在项：${existingLabels.toString()}`
    }

    // 过滤掉已存在的记录
    const filteredItems = data.list.filter((item) => {
      const key = `${item[secondaryKey]}:${item[tertiaryKey]}`
      return !existingLabels.includes(key)
    })

    try {
      res = await db.insertMany(filteredItems)
    } catch (error) {
      ctx.logger.error('Error during insertMany operation:', error)
      return ctx.throw(500, { msg: '服务器内部错误' })
    }
  }

  return { data: res, tip, existingTypes }
}

/**
 * 批量删除
 * @param {Object} ctx
 * @param {Object} db - 数据库
 * @param {Object} data - 请求参数
 * @property {Array} data.list - 批量新增项
 * @property {Boolean} data.cover - 是否覆盖 默认false
 * @param {String} primaryKey - 主键
 */
async function batchDelete(ctx, db, data, primaryKey) {
  let deletedCount = 0

  // 分批处理删除操作，避免单次操作处理过多数据
  for (let i = 0; i < data.list.length; i += batchSize) {
    const batchKeys = data.list.slice(i, i + batchSize)
    const deleteRes = await db.deleteMany({ [primaryKey]: { $in: batchKeys } })
    deletedCount += deleteRes.deletedCount
  }

  // 其他处理
  if (deletedCount == 0) ctx.throw(400, { msg: '无有效数据项删除' })

  return deletedCount
}

module.exports = {
  batchAdd,
  batchAddX,
  batchDelete
}
