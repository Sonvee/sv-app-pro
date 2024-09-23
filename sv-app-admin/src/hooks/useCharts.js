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
function bar3D() {
  const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
  const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday']
  const data = [
    [0, 0, 5],
    [0, 1, 1],
    [0, 2, 0],
    [0, 3, 0],
    [0, 4, 0],
    [0, 5, 0],
    [0, 6, 0],
    [0, 7, 0],
    [0, 8, 0],
    [0, 9, 0],
    [0, 10, 0],
    [0, 11, 2],
    [0, 12, 4],
    [0, 13, 1],
    [0, 14, 1],
    [0, 15, 3],
    [0, 16, 4],
    [0, 17, 6],
    [0, 18, 4],
    [0, 19, 4],
    [0, 20, 3],
    [0, 21, 3],
    [0, 22, 2],
    [0, 23, 5],
    [1, 0, 7],
    [1, 1, 0],
    [1, 2, 0],
    [1, 3, 0],
    [1, 4, 0],
    [1, 5, 0],
    [1, 6, 0],
    [1, 7, 0],
    [1, 8, 0],
    [1, 9, 0],
    [1, 10, 5],
    [1, 11, 2],
    [1, 12, 2],
    [1, 13, 6],
    [1, 14, 9],
    [1, 15, 11],
    [1, 16, 6],
    [1, 17, 7],
    [1, 18, 8],
    [1, 19, 12],
    [1, 20, 5],
    [1, 21, 5],
    [1, 22, 7],
    [1, 23, 2],
    [2, 0, 1],
    [2, 1, 1],
    [2, 2, 0],
    [2, 3, 0],
    [2, 4, 0],
    [2, 5, 0],
    [2, 6, 0],
    [2, 7, 0],
    [2, 8, 0],
    [2, 9, 0],
    [2, 10, 3],
    [2, 11, 2],
    [2, 12, 1],
    [2, 13, 9],
    [2, 14, 8],
    [2, 15, 10],
    [2, 16, 6],
    [2, 17, 5],
    [2, 18, 5],
    [2, 19, 5],
    [2, 20, 7],
    [2, 21, 4],
    [2, 22, 2],
    [2, 23, 4],
    [3, 0, 7],
    [3, 1, 3],
    [3, 2, 0],
    [3, 3, 0],
    [3, 4, 0],
    [3, 5, 0],
    [3, 6, 0],
    [3, 7, 0],
    [3, 8, 1],
    [3, 9, 0],
    [3, 10, 5],
    [3, 11, 4],
    [3, 12, 7],
    [3, 13, 14],
    [3, 14, 13],
    [3, 15, 12],
    [3, 16, 9],
    [3, 17, 5],
    [3, 18, 5],
    [3, 19, 10],
    [3, 20, 6],
    [3, 21, 4],
    [3, 22, 4],
    [3, 23, 1],
    [4, 0, 1],
    [4, 1, 3],
    [4, 2, 0],
    [4, 3, 0],
    [4, 4, 0],
    [4, 5, 1],
    [4, 6, 0],
    [4, 7, 0],
    [4, 8, 0],
    [4, 9, 2],
    [4, 10, 4],
    [4, 11, 4],
    [4, 12, 2],
    [4, 13, 4],
    [4, 14, 4],
    [4, 15, 14],
    [4, 16, 12],
    [4, 17, 1],
    [4, 18, 8],
    [4, 19, 5],
    [4, 20, 3],
    [4, 21, 7],
    [4, 22, 3],
    [4, 23, 0],
    [5, 0, 2],
    [5, 1, 1],
    [5, 2, 0],
    [5, 3, 3],
    [5, 4, 0],
    [5, 5, 0],
    [5, 6, 0],
    [5, 7, 0],
    [5, 8, 2],
    [5, 9, 0],
    [5, 10, 4],
    [5, 11, 1],
    [5, 12, 5],
    [5, 13, 10],
    [5, 14, 5],
    [5, 15, 7],
    [5, 16, 11],
    [5, 17, 6],
    [5, 18, 0],
    [5, 19, 5],
    [5, 20, 3],
    [5, 21, 4],
    [5, 22, 2],
    [5, 23, 0],
    [6, 0, 1],
    [6, 1, 0],
    [6, 2, 0],
    [6, 3, 0],
    [6, 4, 0],
    [6, 5, 0],
    [6, 6, 0],
    [6, 7, 0],
    [6, 8, 0],
    [6, 9, 0],
    [6, 10, 1],
    [6, 11, 0],
    [6, 12, 2],
    [6, 13, 1],
    [6, 14, 3],
    [6, 15, 4],
    [6, 16, 0],
    [6, 17, 0],
    [6, 18, 0],
    [6, 19, 0],
    [6, 20, 1],
    [6, 21, 2],
    [6, 22, 2],
    [6, 23, 6]
  ]

  return {
    tooltip: {},
    visualMap: {
      max: 20,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'category',
      data: hours
    },
    yAxis3D: {
      type: 'category',
      data: days
    },
    zAxis3D: {
      type: 'value'
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      viewControl: {
        // projection: 'orthographic'
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [
      {
        type: 'bar3D',
        data: data.map(function (item) {
          return {
            value: [item[1], item[0], item[2]]
          }
        }),
        shading: 'lambert',
        label: {
          fontSize: 16,
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20,
            color: '#900'
          },
          itemStyle: {
            color: '#900'
          }
        }
      }
    ]
  }
}

/**
 * pie3D 三维环形图
 * @param {Object} option 图表配置
 * @property {Object} option.dataset 数据项配置 {name,value,itemStyle}
 * @property {String} option.dataset.name 名称
 * @property {Number} option.dataset.value 值
 * @property {Object} option.dataset.itemStyle 样式配置 {color:'颜色',opacity:'透明度'}
 * @property {Boolean} option.dataset.hovered 是否悬浮
 * @property {Boolean} option.dataset.selected 是否选中
 * @param {Object} config Pie3D其他参数配置
 * @property {Number} config.internalDiameterRatio 内径/外径的值（0~1之间的浮点数）默认0.5环形，当该值等于0时为饼图
 * @property {Number} config.height 配置每个数据生成的高度
 * @property {Number} config.boxHeight 三维笛卡尔坐标系在三维场景中的高度
 * @description 最后的参数height=100设置最高位为100，配合boxHeight=1参数，可形成最高100，其他高度按比例自动生成
 * @description 若要设置等高，只需height=0或者不设置height，配合boxHeight=20参数，可形成等高20的图
 */
function pie3D(option, config = {}) {
  config = Object.assign({ internalDiameterRatio: 0.5, height: 100, boxHeight: 1 }, config)
  const seriesData = createPie3D(option.dataset.source, config.internalDiameterRatio, config.height)

  // 图表配置
  let defaultSeries = {
    legend: {},
    tooltip: {},
    xAxis3D: { min: -1, max: 1 },
    yAxis3D: { min: -1, max: 1 },
    zAxis3D: { min: -1, max: 1 },
    grid3D: {
      show: false,
      // top: '-2%',
      // 三维笛卡尔坐标系在三维场景中的高度
      boxHeight: config.boxHeight,
      // 用于鼠标的旋转，缩放等视角控制
      viewControl: {
        distance: 200, // 调整视角到主体的距离，类似调整zoom (重要)
        alpha: 30, // 俯仰角
        beta: 20, // 偏转角
        rotateSensitivity: 1, // 设置为0无法旋转
        zoomSensitivity: 1, // 设置为0无法缩放
        panSensitivity: 0, // 设置为0无法平移
        autoRotate: true // 自动旋转
      }
    },
    series: seriesData
  }

  const result = Object.assign(defaultSeries, option)
  return result
}

/**
 * 生成模拟 3D 饼图的配置项
 * @param {Object} pieData 饼图数据
 * @param {Number} internalDiameterRatio 内径/外径的值（0~1之间的浮点数）默认0.5环形，当该值等于0时为饼图
 * @param {Number} height 配置每个数据生成的高度
 * @returns {Object} series配置项参数
 */
function createPie3D(pieData, internalDiameterRatio, height) {
  let series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  let legendData = []
  let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3
  //  计算比例
  let total = 0
  for (let i = 0; i < pieData.length; i++) {
    pieData[i].value = Number(pieData[i].value)
    total += Number(pieData[i].value)
  }
  for (let i = 0; i < pieData.length; i++) {
    pieData[i].proportion = parseFloat(pieData[i].value / total).toFixed(4)
  }
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
        selected: pieData[i].selected ? pieData[i].selected : false,
        hovered: pieData[i].hovered ? pieData[i].hovered : false,
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
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      series[i].pieStatus.selected,
      series[i].pieStatus.hovered,
      k,
      height ? series[i].pieData.proportion * height : 1 //自己自定义传入高度，每个类型按比例生成高度
      // series[i].pieData.value   ==>这个是饼图默认自己生成高度
      // 1 设置为1所有的扇形高度都一样高
    )
    startValue = endValue
    legendData.push(series[i].name)
  }
  return series
}

/**
 * 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
 * @param {Number} startRatio 当前扇形起始比例，取值区间[0, endRatio)
 * @param {Number} endRatio 当前扇形结束比例，取值区间(startRatio, 1]
 * @param {Boolean} isSelected 是否选中，效果参照二维饼图选中效果（单选）
 * @param {Boolean} isHovered 是否放大，效果接近二维饼图高亮（放大）效果（未能实现阴影）
 * @param {Number} k 用于参数方程的一个参数，取值 0~1 之间，通过「内径 / 外径」的值换算而来。
 * @param {Number} height 配置3d扇形高度
 * @returns {Object} 曲面参数方程
 */
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
  let offsetX = isSelected ? Math.cos(midRadian) * 0.2 : 0
  let offsetY = isSelected ? Math.sin(midRadian) * 0.2 : 0
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
    bar3D,
    pie3D
  }
}
