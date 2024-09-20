/**
 * ECharts文档须知
 * @tutorial https://echarts.apache.org/examples/zh/index.html 示例
 * @tutorial https://echarts.apache.org/zh/option.html 配置项
 * @tutorial https://echarts.apache.org/handbook/zh/concepts/dataset 数据集
 * ---------------
 * Vue-ECharts文档
 * @see https://github.com/ecomfe/vue-echarts/blob/HEAD/README.zh-Hans.md
 */

/**
 * 折线图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @returns {Object} 处理后的配置项
 */
function line(option) {
  // 推荐使用数据集(dataset)处理数据
  let defaultOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['电脑', '手机', '平板', '手表']
    },
    dataset: {
      source: [
        { product: '2015年', 电脑: 43.3, 手机: 85.8, 平板: 93.7, 手表: 51.3 },
        { product: '2016年', 电脑: 83.1, 手机: 73.4, 平板: 55.1, 手表: 56.2 },
        { product: '2017年', 电脑: 86.4, 手机: 65.2, 平板: 82.5, 手表: 74.9 }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }, { type: 'line' }]
  }

  const result = Object.assign(defaultOption, option)
  return result
}

/**
 * 柱状图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @returns {Object} 处理后的配置项
 */
function bar(option) {
  // 推荐使用数据集(dataset)处理数据
  let defaultOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['2015年', '2016年', '2017年']
    },
    dataset: {
      dimensions: ['product', '2015年', '2016年', '2017年'],
      source: [
        { product: '电脑', '2015年': 43.3, '2016年': 85.8, '2017年': 93.7 },
        { product: '手机', '2015年': 83.1, '2016年': 73.4, '2017年': 55.1 },
        { product: '平板', '2015年': 86.4, '2016年': 65.2, '2017年': 82.5 },
        { product: '手表', '2015年': 72.4, '2016年': 53.9, '2017年': 39.1 }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }

  const result = Object.assign(defaultOption, option)
  return result
}

/**
 * 饼图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @returns {Object} 处理后的配置项
 */
function pie(option) {
  // 推荐使用数据集(dataset)处理数据
  let defaultOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    dataset: {
      source: [
        { name: '电脑', value: 1048 },
        { name: '手机', value: 735 },
        { name: '平板', value: 580 },
        { name: '手表', value: 484 }
      ]
    },
    series: [
      {
        type: 'pie',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  const result = Object.assign(defaultOption, option)
  return result
}

/**
 * echarts工具hook
 * @returns line | bar | pie
 */
export const useCharts = () => {
  return {
    line,
    bar,
    pie
  }
}
