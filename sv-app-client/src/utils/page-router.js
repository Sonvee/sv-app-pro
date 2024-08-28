import pagesJson from '@/pages.json'

// pages.json路由表匹配
function generateRouteTable(json) {
  let routeTable = [];
  // 主包pages中页面路由
  json.pages.forEach(page => {
    routeTable.push({
      url: page.path,
      name: page.style.navigationBarTitleText
    });
  });
  // 分包subPackages中页面路由（如果有的话）
  json.subPackages?.forEach(subPackage => {
    subPackage.pages.forEach(page => {
      routeTable.push({
        url: `${subPackage.root}/${page.path}`,
        name: page.style.navigationBarTitleText
      });
    });
  });
  return routeTable;
}
/**
 * 获取pages.json路由表
 */
export const pageRouteTable = generateRouteTable(pagesJson)

/**
 * 获取tabBar页面列表
 * @param {string} type 路由类型，'/'表示带/前缀，否则不带
 */
export function getTabBarList(type) {
  let list = []
  if (type === '/') {
    list = pagesJson?.tabBar?.list?.map(item => '/' + item.pagePath)
  } else {
    list = pagesJson?.tabBar?.list?.map(item => item.pagePath)
  }
  return list
}

/**
 * 获取当前页面路由
 * @param {string} type 路由类型，'/'表示带/前缀，否则不带
 */
export function getPageRoute(type) {
  // const pages = getCurrentPages()
  // const page = pages[pages.length - 1]
  // const route = type === '/' ? '/' + page.route : page.route
  // return route
  return '标题'
}