/**
 * ECharts文档须知
 * @tutorial https://echarts.apache.org/examples/zh/index.html 示例
 * @tutorial https://echarts.apache.org/zh/option.html 配置项
 * @tutorial https://echarts.apache.org/handbook/zh/concepts/dataset 数据集 (重要)
 * ---------------
 * Vue-ECharts文档
 * @see https://github.com/ecomfe/vue-echarts/blob/HEAD/README.zh-Hans.md
 */

/**
 * 折线图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @param {String} type 数据类型 dataset数据集(默认) | series系列
 * @returns {Object} 处理后的配置项
 */
function line(option, type = 'dataset') {
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  }
  const legend = {}
  const grid = [{ left: '4%', top: '40', right: '20', bottom: '40', containLabel: true }]

  // 推荐使用数据集(dataset)处理数据
  let defaultDataset = {
    tooltip,
    legend,
    grid,
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }, { type: 'line' }],
    dataset: {
      source: [
        { product: '2015年', 电脑: 43.3, 手机: 85.8, 平板: 93.7, 手表: 51.3 },
        { product: '2016年', 电脑: 83.1, 手机: 73.4, 平板: 55.1, 手表: 56.2 },
        { product: '2017年', 电脑: 86.4, 手机: 65.2, 平板: 82.5, 手表: 74.9 }
      ]
    }
  }

  // 系列(series)处理数据
  let defaultSeries = {
    tooltip,
    legend,
    grid,
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Email',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        data: [220, 82, 191, 104, 290, 130, 310]
      }
    ]
  }

  const result = Object.assign(type == 'dataset' ? defaultDataset : defaultSeries, option)
  return result
}

/**
 * 柱状图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @param {String} type 数据类型 dataset数据集(默认) | series系列
 * @returns {Object} 处理后的配置项
 */
function bar(option, type = 'dataset') {
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  }
  const legend = {}
  const grid = [{ left: '4%', top: '40', right: '20', bottom: '40', containLabel: true }]

  // 推荐使用数据集(dataset)处理数据
  let defaultDataset = {
    tooltip,
    legend,
    grid,
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
    dataset: {
      dimensions: ['product', '2015年', '2016年', '2017年'],
      source: [
        { product: '电脑', '2015年': 43.3, '2016年': 85.8, '2017年': 93.7 },
        { product: '手机', '2015年': 83.1, '2016年': 73.4, '2017年': 55.1 },
        { product: '平板', '2015年': 86.4, '2016年': 65.2, '2017年': 82.5 },
        { product: '手表', '2015年': 72.4, '2016年': 53.9, '2017年': 39.1 }
      ]
    }
  }

  // 系列(series)处理数据
  let defaultSeries = {
    tooltip,
    legend,
    grid,
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Email',
        type: 'bar',
        label: {
          show: true,
          // position: 'left',
          valueAnimation: true
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'bar',
        label: {
          show: true,
          // position: 'left',
          valueAnimation: true
        },
        data: [220, 82, 191, 104, 290, 130, 310]
      }
    ]
  }

  const result = Object.assign(type == 'dataset' ? defaultDataset : defaultSeries, option)
  return result
}

/**
 * 饼图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @param {String} type 数据类型 dataset数据集(默认) | series系列
 * @returns {Object} 处理后的配置项
 */
function pie(option, type = 'dataset') {
  const tooltip = {
    trigger: 'item'
  }
  const legend = {}

  // 推荐使用数据集(dataset)处理数据
  let defaultDataset = {
    tooltip,
    legend,
    series: [{ type: 'pie' }],
    dataset: {
      source: [
        { name: '电脑', value: 1048 },
        { name: '手机', value: 735 },
        { name: '平板', value: 580 },
        { name: '手表', value: 484 }
      ]
    }
  }

  // 系列(series)处理数据
  let defaultSeries = {
    tooltip,
    legend
  }

  const result = Object.assign(type == 'dataset' ? defaultDataset : defaultSeries, option)
  return result
}

/**
 * 地图
 * @param {Object} option 配置项
 * @see https://echarts.apache.org/zh/option.html
 * @param {String} type 数据类型 dataset数据集(默认) | series系列
 * @returns {Object} 处理后的配置项
 */
function map(option, type = 'dataset') {
  const tooltip = {
    trigger: 'item',
    formatter: (params) => {
      if (!params.value) return
      const cube = `<span style="display:inline-block;width:10px;height:10px;margin-right:5px;border-radius:50%;background:${params.color}"></span>`
      return `<div>${params.name}<div>
              <div>${cube}${params.seriesName}<b style="float:right;margin-left:20px;">${params.data.value}</b></div>
              <div>${cube}占比<b style="float:right;margin-left:20px;">${params.data.ratio}%</b></div>`
    }
  }
  const legend = { show: false }
  const visualMap = {
    min: 0,
    max: 2000,
    dimension: 'value'
  }
  // DataV上的GeoJson需要名称映射
  const nameMap = {
    北京市: '北京',
    天津市: '天津',
    河北省: '河北',
    山西省: '山西',
    内蒙古自治区: '内蒙古',
    辽宁省: '辽宁',
    吉林省: '吉林',
    黑龙江省: '黑龙江',
    上海市: '上海',
    江苏省: '江苏',
    浙江省: '浙江',
    安徽省: '安徽',
    福建省: '福建',
    江西省: '江西',
    山东省: '山东',
    河南省: '河南',
    湖北省: '湖北',
    湖南省: '湖南',
    广东省: '广东',
    广西壮族自治区: '广西',
    海南省: '海南',
    重庆市: '重庆',
    四川省: '四川',
    贵州省: '贵州',
    云南省: '云南',
    西藏自治区: '西藏',
    陕西省: '陕西',
    甘肃省: '甘肃',
    青海省: '青海',
    宁夏回族自治区: '宁夏',
    新疆维吾尔自治区: '新疆'
  }

  // 推荐使用数据集(dataset)处理数据
  let defaultDataset = {
    tooltip,
    legend,
    visualMap,
    series: [
      {
        type: 'map',
        map: 'china',
        zoom: 1.2,
        name: '浏览量(PV)',
        nameMap
      }
    ],
    dataset: {
      dimensions: ['name', 'value', 'ratio'],
      source: [
        { name: '上海市', value: 827, ratio: 92.4 },
        { name: '江苏省', value: 50, ratio: 5.59 },
        { name: '山东省', value: 13, ratio: 1.45 },
        { name: '河南省', value: 2, ratio: 0.22 },
        { name: '北京市', value: 2, ratio: 0.22 },
        { name: '广东省', value: 1, ratio: 0.11 }
      ]
    }
  }

  // 系列(series)处理数据
  let defaultSeries = {
    tooltip,
    legend,
    visualMap,
    series: [
      {
        type: 'map',
        map: 'china',
        zoom: 1.2,
        name: '浏览量(PV)',
        nameMap,
        data: [
          { name: '上海市', value: 827, ratio: 92.4 },
          { name: '江苏省', value: 50, ratio: 5.59 },
          { name: '山东省', value: 13, ratio: 1.45 },
          { name: '河南省', value: 2, ratio: 0.22 },
          { name: '北京市', value: 2, ratio: 0.22 },
          { name: '广东省', value: 1, ratio: 0.11 }
        ]
      }
    ]
  }

  const result = Object.assign(type == 'dataset' ? defaultDataset : defaultSeries, option)
  return result
}

/**
 * ===================================================
 * 自定义特殊图表系列
 * ===================================================
 */

/**
 * pie3D 三维环形图
 */
function pie3D(option) {
  const optionsData = [
    { name: '秸秆', value: 20 },
    { name: '粪污', value: 50 },
    { name: '厨余', value: 30 }
  ]
  const result = {
    animation: true,
    tooltip: {},
    label: { show: true, position: 'outside' },
    xAxis3D: { min: -1, max: 1 },
    yAxis3D: { min: -1, max: 1 },
    zAxis3D: { min: -1, max: 1 },
    grid3D: {
      show: false,
      boxHeight: 1,
      viewControl: {
        distance: 200,
        alpha: 30,
        beta: 0,
        autoRotate: true // 自动旋转
      }
    },
    series: getPie3D(optionsData, 0.5)
  }
  return result
}
// 生成模拟 3D 饼图的配置项
function getPie3D(pieData, internalDiameterRatio) {
  let series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  let legendData = []
  let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3
  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value
    let seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k
      }
    }
    if (typeof pieData[i].itemStyle != 'undefined') {
      let itemStyle = {}
      typeof pieData[i].itemStyle.color != 'undefined' ? (itemStyle.color = pieData[i].itemStyle.color) : null
      typeof pieData[i].itemStyle.opacity != 'undefined' ? (itemStyle.opacity = pieData[i].itemStyle.opacity) : null
      seriesItem.itemStyle = itemStyle
    }
    series.push(seriesItem)
  }
  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value
    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value)
    startValue = endValue
    legendData.push(series[i].name)
  }
  return series
}
// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height) {
  let midRatio = (startRatio + endRatio) / 2
  let startRadian = startRatio * Math.PI * 2
  let endRadian = endRatio * Math.PI * 2
  let midRadian = midRatio * Math.PI * 2
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1
  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20
    },
    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
    },
    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u)
      }
      return Math.sin(v) > 0 ? 1 * height : -1
    }
  }
}

/**
 * echarts工具hook
 * @returns line | bar | pie
 */
export const useCharts = () => {
  return {
    line,
    bar,
    pie,
    map,
    pie3D
  }
}
