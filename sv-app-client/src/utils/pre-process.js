/**
 * 关于隐藏原生tabbar的问题
 * 官方bug：当tab页还未渲染完成时隐藏tabbar会报错：hideTabBar:fail not TabBar page
 * 解决方法：
 * 1. 将tabBar中height设置成0.000001px（实测设置成0或0px无效）√
 * 2. 加短暂的适当的延时器（不建议）
 * 3. 在首页的onLoad中进行hideTabBar，注意在onLaunch中无效（推荐）√
 */

// 预处理
export async function preProcess() {
	console.log('=== App 启动预处理 ===');

	// 初始系统配置参数
	initSysConfig()

}

function initSysConfig() {
}