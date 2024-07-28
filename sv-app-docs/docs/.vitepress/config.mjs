import { defineConfig } from 'vitepress'
import { linkMenu, baseMenu, frameMenu, pluginsMenu, componentsMenu, socialLinks } from './theme/data/menu'

const deployConfig = {
  // h5部署
  h5: {
    base: '',
    outDir: '../docs-h5'
  },
  // GithubPages部署
  github: {
    base: 'sv-app-pro/sv-app-docs/docs-github',
    outDir: '../docs-github'
  },
  // uni部署
  uni: {
    base: '/docs-uni',
    outDir: '../docs-uni'
  }
}

// 部署模式 - 打包时需要切换三种模式依次进行打包，再分别发布对应平台
const platform = 'h5'

export default defineConfig({
  base: deployConfig[platform].base,
  outDir: deployConfig[platform].outDir,
  lang: 'zh-CN',
  title: 'sv-app',
  description: '一个基于 vue3 + uniapp + unicloud 开发的框架',
  // cleanUrls: true,
  lastUpdated: true,

  vite: {
    // vite 配置选项
    server: {
      host: '0.0.0.0', // 允许IP访问
      port: 4060, // 端口
      open: true // 运行是否自动打开浏览器
    }
  },

  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },

  head: [
    ['link', { rel: 'icon', href: deployConfig[platform].base + '/favicon.ico' }], // 需要加上根目录前缀，否则资源访问不到
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?c785b843215f0b29f2821147cbb7aca8";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ] // 百度统计
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'sv-app',
    lastUpdatedText: '最后更新',

    // 导航栏
    nav: [{ text: '🚀快速开始', link: '/src/base/quick' }, frameMenu, pluginsMenu, componentsMenu, linkMenu, { text: '☕一杯咖啡', link: '/src/donate/donate' }],

    // 左侧栏
    sidebar: [baseMenu, frameMenu, pluginsMenu, componentsMenu, { text: '☕一杯咖啡', link: '/src/donate/donate' }, { text: '🎉鸣谢', link: '/src/thank/thank' }],

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: socialLinks
  }
})
