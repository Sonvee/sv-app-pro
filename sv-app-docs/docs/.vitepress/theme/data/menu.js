export const linkMenu = {
  text: '相关链接',
  items: [
    {
      text: 'Vue3',
      link: 'https://cn.vuejs.org'
    },
    {
      text: 'uni-app',
      link: 'https://uniapp.dcloud.net.cn'
    },
    {
      text: 'EggJS',
      link: 'https://www.eggjs.org/zh-CN'
    }
  ]
}

export const baseMenu = {
  text: '基础',
  collapsed: false,
  items: [
    {
      text: '快速开始',
      link: '/src/base/quick'
    },
    {
      text: '常见问题',
      link: '/src/base/problem'
    },
    {
      text: '博客文章',
      link: '/src/base/blog'
    },
    {
      text: '更新日志',
      link: '/src/base/log'
    }
  ]
}

export const frameMenu = {
  text: '框架',
  collapsed: false,
  items: [
    {
      text: '框架概况',
      link: '/src/frame/intro/intro'
    },
    {
      text: '服务端',
      link: '/src/frame/sv-app-server/sv-app-server'
    },
    {
      text: '客户端',
      link: '/src/frame/sv-app-client/sv-app-client'
    },
    {
      text: '管理端',
      link: '/src/frame/sv-app-admin/sv-app-admin'
    }
  ]
}

export const pluginsMenu = {
  text: '插件',
  collapsed: false,
  items: [
    {
      text: '插件概况',
      link: '/src/plugins/intro/intro'
    }
  ]
}

export const componentsMenu = {
  text: '组件',
  collapsed: false,
  items: [
    {
      text: '客户端',
      collapsed: false,
      items: []
    },
    {
      text: '管理端',
      collapsed: false,
      items: []
    }
  ]
}

export const socialLinks = [
  { icon: 'github', link: 'https://github.com/Sonvee/sv-app-pro' },
  {
    icon: {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0m6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>`
    },
    link: 'https://gitee.com/Sonve/sv-app-pro',
    ariaLabel: 'Gitee'
  },
  {
    icon: {
      svg: `<svg t="1713778098002" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2278" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#2B9939" p-id="2279"></path><path d="M347.33473185 704.1094791h334.50868979V235.83183485h111.46837529v579.78054125H235.83183485V235.83183485h111.502897v468.27764425z" fill="#ffffff" p-id="2280"></path></svg>`
    },
    link: 'https://ext.dcloud.net.cn/publisher?id=1173575',
    ariaLabel: 'DCloud'
  },
  {
    icon: {
      svg: '<svg t="1694688365239" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4048" width="32" height="32"><path d="M980.79827 694.105946c-21.144216-122.796973-109.844757-203.250162-109.844757-203.250162 12.647784-111.477622-33.792-131.26573-33.792-131.26573C827.392 14.668108 530.985514 20.67373 524.730811 20.839784 518.476108 20.67373 222.01427 14.668108 212.300108 359.590054c0 0-46.467459 19.788108-33.819676 131.26573 0 0-88.700541 80.453189-109.817081 203.250162 0 0-11.291676 207.484541 101.403676 25.40627 0 0 25.350919 69.161514 71.790703 131.26573 0 0-83.082378 28.256865-75.997405 101.625081 0 0-2.87827 81.836973 177.401081 76.218811 0 0 126.699243-9.852541 164.753297-63.515676l16.605405 0 0.276757 0 16.633081 0c38.026378 53.635459 164.725622 63.515676 164.725622 63.515676 180.224 5.618162 177.401081-76.218811 177.401081-76.218811 7.029622-73.368216-75.997405-101.625081-75.997405-101.625081 46.439784-62.104216 71.790703-131.26573 71.790703-131.26573C992.034595 901.590486 980.79827 694.105946 980.79827 694.105946z" p-id="4049" fill="#88BAFF"></path></svg>'
    },
    link: 'https://qm.qq.com/cgi-bin/qm/qr?k=HD9IXnUruOa5pplF1jAeQsLb9BNnP_DE&jump_from=webapi&authKey=tk61Q5la3EAprdYcUBD7v0PBly795OTcT4UT36XxqcG7pmhGRpE+yFlt75vQBWeY',
    ariaLabel: 'QQ'
  }
]
