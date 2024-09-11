const ExcelJS = require('exceljs')

/**
 * 创建excel工作表（常规）
 * @tutorial https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md
 * @param {ctx} ctx EggJS上下文 必填
 * @param {Object} options - 配置参数
 * @property {String} options.sheetName -  工作表名称（可选）默认Sheet1
 * @property {Object} options.sheetOption - 工作表配置（可选）
 * @property {Array} options.columns - 表头（必填）
 * @property {Array} options.data - 数据（必填）
 * @property {String} options.fileName - 文件名（可选）默认未命名
 * @returns {Promise} buffer - 二进制文件
 */
async function createWorkSheet(ctx, options) {
  let {
    sheetName = 'Sheet1', // 工作表名称
    sheetOption, // 工作表配置
    columns, // 表头
    data, // 数据
    fileName = '未命名' // 文件名
  } = options

  // 创建一个新的工作簿对象
  const workbook = new ExcelJS.Workbook()
  // 添加一个新的工作表
  const worksheet = workbook.addWorksheet(sheetName, sheetOption)

  // 所有列的全局默认样式
  columns.forEach((item) => {
    if (!item.style) item.style = {}
    if (!item.style.alignment) item.style.alignment = {}
    if (!item.style.alignment.vertical) item.style.alignment.vertical = 'middle'
  })

  // 设置表头（列）
  worksheet.columns = columns
  // 给表头行设置样式
  const header = worksheet.getRow(1)
  header.height = 24
  header.font = { name: '黑体', size: 12, color: { argb: 'ff0000' }, bold: true }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f8f8f8' } }
  header.alignment = { vertical: 'middle', horizontal: 'center' }
  header.border = {
    top: { style: 'thin', color: { argb: 'd4d4d4' } },
    left: { style: 'thin', color: { argb: 'd4d4d4' } },
    bottom: { style: 'thin', color: { argb: 'd4d4d4' } },
    right: { style: 'thin', color: { argb: 'd4d4d4' } }
  }

  // 数据对象扁平化处理，需要在查询时开启lean，否则扁平的不是data数据而是mongoose文档
  data = flattenProperties(data)

  // 填充数据
  data.forEach((rowData) => {
    const handleRow = extractKeysPlus(columns, rowData)
    worksheet.addRow(handleRow)
  })

  // 设置响应类型为Excel文件
  ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  ctx.set('Access-Control-Expose-Headers', 'Content-Disposition,download-filename')
  // 设置正确的Content-Disposition响应头
  ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${fileName}.xlsx`)

  try {
    const buffer = await workbook.xlsx.writeBuffer() // 将工作簿内容写入Buffer
    return buffer
  } catch (error) {
    throw error
  }
}

/**
 * Excel单文件读取，并转换为JSON
 * @param {String} filepath excel文件路径
 * @param {Array} header 表头
 * @returns {Object} 转换的JSON格式数据
 */
async function readExcelFileToJson(filepath, header) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filepath)

  const sheetsData = {}

  // 遍历工作表
  workbook.eachSheet((sheet, sheetIdx) => {
    sheetsData[sheet.name] = []

    sheet.eachRow((row, rowNumber) => {
      const rowData = {}
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[cell.address] = cell.text // 获取单元格地址及其值
      })
      sheetsData[sheet.name].push(rowData)
    })
  })

  let excelData = [] // 文件数据
  // 遍历exceljson对象，以获取每个sheet中数据
  for (let key in sheetsData) {
    const parseSheetData = transformDataByHeader(sheetsData[key], header)
    Array.prototype.push.apply(excelData, parseSheetData) // 直接追加数据而不创建新数组
  }

  // 数据格式化（Boolean，Number等类型还原）
  excelData = formatPropertyType(excelData, header)

  return excelData
}

/**
 * Excel多文件读取，并转换为JSON
 * @param {Array<File>} files excel文件数组
 * @param {Array} header 表头
 * @returns {Object} 转换的JSON格式数据
 */
async function readExcelFilesToJson(files, header) {
  let allExcelData = [] // 所有文件数据

  // 开始读取文件数据
  for (let i = 0; i < files.length; i++) {
    const item = files[i]
    const excelData = await readExcelFileToJson(item.filepath, header)
    Array.prototype.push.apply(allExcelData, excelData) // 直接追加数据而不创建新数组
  }

  return allExcelData
}

// 转换函数
/**
 * 根据表头字段，将表格数据转换为JSON格式
 * @param {Array} data 要转换的数据
 * @param {Array} header 表头 [{ column: 'A', name: '序号', field: 'sort', type: 'number' }, ...]
 * @returns {Array} 转换后的数据
 */
function transformDataByHeader(data, header) {
  // 移除表头行（第一行）的同时获取表头
  const head = data.shift()

  // 表头验证
  const valid = validateHeader(header, head)
  if (!valid) return [] // 如果表头不匹配，则返回空数组

  // 先进行表头严格匹配
  return data.map((item) => {
    let fieldItem = {}
    for (let key in item) {
      let fieldKey = header.find((i) => i.column == key.substring(0, 1)).field
      if (fieldKey) {
        fieldItem[fieldKey] = item[key]
      }
    }
    return fieldItem
  })
}

/**
 * 表头验证
 * @param {Array} expectedHeaders 标准表头
 * @param {Array} dataHeaders 实际表头
 * @returns {Boolean} 是否通过验证
 */
function validateHeader(expectedHeaders, dataHeaders) {
  // 去除实际表头中可能存在的制表符
  for (let key in dataHeaders) {
    if (dataHeaders.hasOwnProperty(key)) {
      dataHeaders[key] = dataHeaders[key].trim()
    }
  }

  // 创建一个映射存储预期的列标识符到其详情的映射
  const expectedHeaderMap = {}
  expectedHeaders.forEach((header) => {
    expectedHeaderMap[header.column] = header
  })

  // 遍历数据中的表头对象
  for (const key in dataHeaders) {
    // 忽略键后面的数字，并提取出基本的列标识符（如'A1' -> 'A'）
    const baseColumn = key.match(/^[A-Z]/)[0]
    // 检查此列是否存在并且名字是否一致
    if (!expectedHeaderMap.hasOwnProperty(baseColumn) || expectedHeaderMap[baseColumn].name !== dataHeaders[key]) {
      return false // 如果有任何一项不符合，则返回false
    }
  }

  // 如果所有项都符合，则返回true
  return true
}

/**
 * 扁平化对象型数组
 * @param {Array} array 要扁平化对象的数组
 * @returns 扁平化对象后的数组
 */
function flattenProperties(array) {
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        return { ...acc, ...flattenObject(obj[key], prefix ? `${prefix}.${key}` : key) }
      } else {
        return { ...acc, [prefix ? `${prefix}.${key}` : key]: obj[key] }
      }
    }, {})
  }

  return array.map((item) => {
    const newItem = {}
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === 'object' && item[key] !== null) {
        Object.assign(newItem, flattenObject(item[key], key))
      } else {
        newItem[key] = item[key]
      }
    })
    return newItem
  })
}

/**
 * 格式化数组中的对象 - 导入时用
 * @param {Array<Object>} array - 需要格式化的数组
 * @param {Array<Object>} header - 表头携带类型
 * @returns {Array<Object>} 格式化后的数组
 */
function formatPropertyType(array, header) {
  return array.map((item) => {
    const newItem = {}

    for (let key in item) {
      let value = item[key]

      // 查找key对应表头的类型
      const type = header.find((h) => h.field === key)?.type

      switch (type) {
        case 'number':
          value = Number(value)
          break
        case 'boolean':
          value = value === 'true' ? true : false
          break
        default:
          // 其他类型均不做处理
          break
      }

      // 设置新的键值对
      newItem[key] = value
    }

    return newItem
  })
}

/**
 * 对象提取拓展版 - 导出时用
 * @param {Array} keys 要提取的键名数组，可携带对应类型 [{ key: 'sort', type: 'number' }, ...]
 * @param {Object} obj 要提取的对象
 * @returns {Object} 提取后的对象
 */
function extractKeysPlus(keys, obj) {
  // 创建一个新的对象用于存储提取的结果
  const extractedObj = {}

  // 遍历keys数组
  keys.forEach((item) => {
    // 如果键存在于obj中，则将其添加到extractedObj中
    if (obj.hasOwnProperty(item.key)) {
      switch (item.type) {
        case 'number':
          extractedObj[item.key] = Number(obj[item.key])
          break
        case 'boolean':
          extractedObj[item.key] = obj[item.key] == 'true' ? true : false
          break
        default:
          extractedObj[item.key] = obj[item.key]
          break
      }
    }
  })

  return extractedObj
}

const useExcel = () => {
  return {
    createWorkSheet,
    readExcelFileToJson,
    readExcelFilesToJson,
    transformDataByHeader
  }
}

module.exports = useExcel
