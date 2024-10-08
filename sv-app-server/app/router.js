/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app

  router.prefix('/api')

  // 欢迎
  router.get('/home', controller.home.index)
  router.get('/test', controller.home.test)

  // 测试用例
  router.post('/test/testList', controller.testDemo.testList)
  router.post('/test/testAdd', controller.testDemo.testAdd)
  router.post('/test/testUpdate', controller.testDemo.testUpdate)
  router.post('/test/testDelete', controller.testDemo.testDelete)
  router.post('/test/testBatchAdd', controller.testDemo.testBatchAdd)
  router.post('/test/testBatchDelete', controller.testDemo.testBatchDelete)

  router.post('/test/testforeignList', controller.testForeign.testforeignList)
  router.post('/test/testforeignAdd', controller.testForeign.testforeignAdd)
  router.post('/test/testforeignUpdate', controller.testForeign.testforeignUpdate)
  router.post('/test/testforeignDelete', controller.testForeign.testforeignDelete)
  router.post('/test/testforeignBatchAdd', controller.testForeign.testforeignBatchAdd)
  router.post('/test/testforeignBatchDelete', controller.testForeign.testforeignBatchDelete)

  // 登录相关
  router.post('/user/login', controller.sysLogin.login)
  router.post('/user/loginByEmailer', controller.sysLogin.loginByEmailer)
  router.post('/user/loginByWechat', controller.sysLogin.loginByWechat)
  router.post('/user/register', controller.sysLogin.register)
  router.post('/user/logout', controller.sysLogin.logout)
  router.post('/user/refreshToken', controller.sysLogin.refreshToken)
  router.get('/user/hasAdmin', controller.sysLogin.hasAdmin)
  router.get('/user/verifyToken', controller.sysLogin.verifyToken)
  // 验证码
  router.post('/auth/getCaptcha', controller.sysAuth.getCaptcha)
  router.post('/auth/emailCaptcha', controller.sysAuth.emailCaptcha)

  // 账号
  router.post('/user/userList', controller.sysUser.userList)
  router.get('/user/userSelf', controller.sysUser.userSelf)
  router.post('/user/userUpdate', controller.sysUser.userUpdate)
  router.post('/user/userUpdateSimple', controller.sysUser.userUpdateSimple)
  router.post('/user/changePassword', controller.sysUser.changePassword)
  router.post('/user/changePasswordByEmail', controller.sysUser.changePasswordByEmail)
  router.post('/user/bindEmail', controller.sysUser.bindEmail)
  router.post('/user/bindWechat', controller.sysUser.bindWechat)
  router.post('/user/userDeactivate', controller.sysUser.userDeactivate)
  router.post('/user/userDelete', controller.sysUser.userDelete)

  // 角色
  router.post('/user/roleList', controller.sysRole.roleList)
  router.post('/user/findPermissionByRole', controller.sysRole.findPermissionByRole)
  router.post('/user/roleAdd', controller.sysRole.roleAdd)
  router.post('/user/roleUpdate', controller.sysRole.roleUpdate)
  router.post('/user/roleDelete', controller.sysRole.roleDelete)
  router.post('/user/roleBatchAdd', controller.sysRole.roleBatchAdd)
  router.post('/user/roleBatchDelete', controller.sysRole.roleBatchDelete)
  router.get('/user/roleExcelTemplate', controller.sysRole.roleExcelTemplate)
  router.post('/user/roleImport', controller.sysRole.roleImport)
  router.post('/user/roleExport', controller.sysRole.roleExport)

  // 权限
  router.post('/user/permissionList', controller.sysPermission.permissionList)
  router.post('/user/permissionAdd', controller.sysPermission.permissionAdd)
  router.post('/user/permissionUpdate', controller.sysPermission.permissionUpdate)
  router.post('/user/permissionDelete', controller.sysPermission.permissionDelete)
  router.post('/user/permissionBatchAdd', controller.sysPermission.permissionBatchAdd)
  router.post('/user/permissionBatchDelete', controller.sysPermission.permissionBatchDelete)
  router.get('/user/permissionExcelTemplate', controller.sysPermission.permissionExcelTemplate)
  router.post('/user/permissionImport', controller.sysPermission.permissionImport)
  router.post('/user/permissionExport', controller.sysPermission.permissionExport)

  // 菜单
  router.post('/sys/menuList', controller.sysMenu.menuList)
  router.get('/sys/authMenuList', controller.sysMenu.authMenuList)
  router.post('/sys/menuAdd', controller.sysMenu.menuAdd)
  router.post('/sys/menuUpdate', controller.sysMenu.menuUpdate)
  router.post('/sys/menuDelete', controller.sysMenu.menuDelete)
  router.post('/sys/menuBatchAdd', controller.sysMenu.menuBatchAdd)
  router.post('/sys/menuBatchDelete', controller.sysMenu.menuBatchDelete)
  router.get('/sys/menuExcelTemplate', controller.sysMenu.menuExcelTemplate)
  router.post('/sys/menuImport', controller.sysMenu.menuImport)
  router.post('/sys/menuExport', controller.sysMenu.menuExport)

  // 字典
  router.post('/sys/dictList', controller.sysDict.dictList)
  router.post('/sys/dictAdd', controller.sysDict.dictAdd)
  router.post('/sys/dictUpdate', controller.sysDict.dictUpdate)
  router.post('/sys/dictDelete', controller.sysDict.dictDelete)
  router.post('/sys/dictBatchAdd', controller.sysDict.dictBatchAdd)
  router.post('/sys/dictBatchDelete', controller.sysDict.dictBatchDelete)
  router.get('/sys/dictExcelTemplate', controller.sysDict.dictExcelTemplate)
  router.post('/sys/dictImport', controller.sysDict.dictImport)
  router.post('/sys/dictExport', controller.sysDict.dictExport)

  // 字典项
  router.post('/sys/dictitemList', controller.sysDictitem.dictitemList)
  router.post('/sys/dictitemListByRedis', controller.sysDictitem.dictitemListByRedis)
  router.post('/sys/dictitemAdd', controller.sysDictitem.dictitemAdd)
  router.post('/sys/dictitemUpdate', controller.sysDictitem.dictitemUpdate)
  router.post('/sys/dictitemDelete', controller.sysDictitem.dictitemDelete)
  router.post('/sys/dictitemBatchAdd', controller.sysDictitem.dictitemBatchAdd)
  router.post('/sys/dictitemBatchDelete', controller.sysDictitem.dictitemBatchDelete)
  router.get('/sys/dictitemExcelTemplate', controller.sysDictitem.dictitemExcelTemplate)
  router.post('/sys/dictitemImport', controller.sysDictitem.dictitemImport)
  router.post('/sys/dictitemExport', controller.sysDictitem.dictitemExport)

  // 日志
  router.post('/sys/logList', controller.sysLog.logList)
  router.post('/sys/logDelete', controller.sysLog.logDelete)
  router.post('/sys/logBatchDelete', controller.sysLog.logBatchDelete)
  router.post('/sys/logClear', controller.sysLog.logClear)
  router.post('/sys/logExport', controller.sysLog.logExport)

  // 文件
  router.post('/file/avatarUpload', controller.file.avatarUpload)
  router.post('/file/myfileDelete', controller.file.myfileDelete)
  router.post('/file/userfilesDelete', controller.file.userfilesDelete)
  router.post('/file/releaseUpload', controller.file.releaseUpload)
  router.post('/file/releaseImageUpload', controller.file.releaseImageUpload)
  router.post('/file/feedbackImageUpload', controller.file.feedbackImageUpload)
  router.post('/file/editorImgUpload', controller.file.editorImgUpload)

  // 缓存
  router.post('/cache/cacheKeyList', controller.sysCache.cacheKeyList)
  router.post('/cache/cacheValueByKey', controller.sysCache.cacheValueByKey)
  router.post('/cache/cacheDelete', controller.sysCache.cacheDelete)

  // APP版本发布
  router.post('/app/releaseList', controller.appRelease.releaseList)
  router.post('/app/releaseLatest', controller.appRelease.releaseLatest)
  router.post('/app/releaseAdd', controller.appRelease.releaseAdd)
  router.post('/app/releaseUpdate', controller.appRelease.releaseUpdate)
  router.post('/app/releaseDelete', controller.appRelease.releaseDelete)

  // 通知公告
  router.post('/app/noticeList', controller.appNotice.noticeList)
  router.post('/app/noticeInTime', controller.appNotice.noticeInTime)
  router.post('/app/noticeAdd', controller.appNotice.noticeAdd)
  router.post('/app/noticeUpdate', controller.appNotice.noticeUpdate)
  router.post('/app/noticeDelete', controller.appNotice.noticeDelete)
  router.post('/app/noticeBatchAdd', controller.appNotice.noticeBatchAdd)
  router.post('/app/noticeBatchDelete', controller.appNotice.noticeBatchDelete)

  // 帮助
  router.post('/app/helpList', controller.appHelp.helpList)
  router.post('/app/helpAdd', controller.appHelp.helpAdd)
  router.post('/app/helpUpdate', controller.appHelp.helpUpdate)
  router.post('/app/helpDelete', controller.appHelp.helpDelete)
  router.post('/app/helpBatchAdd', controller.appHelp.helpBatchAdd)
  router.post('/app/helpBatchDelete', controller.appHelp.helpBatchDelete)
  router.get('/app/helpExcelTemplate', controller.appHelp.helpExcelTemplate)
  router.post('/app/helpImport', controller.appHelp.helpImport)
  router.post('/app/helpExport', controller.appHelp.helpExport)

  // 反馈
  router.post('/app/feedbackList', controller.appFeedback.feedbackList)
  router.post('/app/feedbackAdd', controller.appFeedback.feedbackAdd)
  router.post('/app/feedbackUpdate', controller.appFeedback.feedbackUpdate)
  router.post('/app/feedbackDelete', controller.appFeedback.feedbackDelete)
  router.post('/app/feedbackBatchAdd', controller.appFeedback.feedbackBatchAdd)
  router.post('/app/feedbackBatchDelete', controller.appFeedback.feedbackBatchDelete)

  // 会员套餐
  router.post('/vip/planList', controller.vipPlan.planList)
  router.post('/vip/planAdd', controller.vipPlan.planAdd)
  router.post('/vip/planUpdate', controller.vipPlan.planUpdate)
  router.post('/vip/planDelete', controller.vipPlan.planDelete)
  router.post('/vip/planBatchAdd', controller.vipPlan.planBatchAdd)
  router.post('/vip/planBatchDelete', controller.vipPlan.planBatchDelete)
  router.get('/vip/planExcelTemplate', controller.vipPlan.planExcelTemplate)
  router.post('/vip/planImport', controller.vipPlan.planImport)
  router.post('/vip/planExport', controller.vipPlan.planExport)

  // 会员权益
  router.post('/vip/benefitList', controller.vipBenefit.benefitList)
  router.post('/vip/benefitAdd', controller.vipBenefit.benefitAdd)
  router.post('/vip/benefitUpdate', controller.vipBenefit.benefitUpdate)
  router.post('/vip/benefitDelete', controller.vipBenefit.benefitDelete)
  router.post('/vip/benefitBatchAdd', controller.vipBenefit.benefitBatchAdd)
  router.post('/vip/benefitBatchDelete', controller.vipBenefit.benefitBatchDelete)
  router.get('/vip/benefitExcelTemplate', controller.vipBenefit.benefitExcelTemplate)
  router.post('/vip/benefitImport', controller.vipBenefit.benefitImport)
  router.post('/vip/benefitExport', controller.vipBenefit.benefitExport)

  // 激活码
  router.post('/vip/cdkeyList', controller.vipCdkey.cdkeyList)
  router.post('/vip/cdkeyAdd', controller.vipCdkey.cdkeyAdd)
  router.post('/vip/cdkeyUpdate', controller.vipCdkey.cdkeyUpdate)
  router.post('/vip/cdkeyDelete', controller.vipCdkey.cdkeyDelete)
  router.post('/vip/cdkeyClear', controller.vipCdkey.cdkeyClear)
  router.post('/vip/cdkeyCheck', controller.vipCdkey.cdkeyCheck)
  router.post('/vip/cdkeyBatchDelete', controller.vipCdkey.cdkeyBatchDelete)
  router.post('/vip/cdkeyActive', controller.vipCdkey.cdkeyActive)

  // 订阅
  router.post('/vip/subscriptionList', controller.vipSubscription.subscriptionList)
  router.post('/vip/subscriptionAdd', controller.vipSubscription.subscriptionAdd)
  router.post('/vip/subscriptionUpdate', controller.vipSubscription.subscriptionUpdate)
  router.post('/vip/subscriptionDelete', controller.vipSubscription.subscriptionDelete)
  router.post('/vip/subscriptionBatchDelete', controller.vipSubscription.subscriptionBatchDelete)
  router.post('/vip/subscriptionInfo', controller.vipSubscription.subscriptionInfo)

  // 百度统计
  router.get('/analytics/baiduTokenCode', controller.baiduAnalytics.baiduTokenCode)
  router.get('/analytics/baiduTokenByCode', controller.baiduAnalytics.baiduTokenByCode)
  router.get('/analytics/refreshBaiduToken', controller.baiduAnalytics.refreshBaiduToken)
  router.post('/analytics/siteList', controller.baiduAnalytics.siteList)
  router.post('/analytics/outline', controller.baiduAnalytics.outline)
  router.post('/analytics/timeTrendRpt', controller.baiduAnalytics.timeTrendRpt)
  router.post('/analytics/districtRpt', controller.baiduAnalytics.districtRpt)
  router.post('/analytics/commonTrackRpt', controller.baiduAnalytics.commonTrackRpt)
  router.post('/analytics/overviewAge', controller.baiduAnalytics.overviewAge)
  router.post('/analytics/trendTime', controller.baiduAnalytics.trendTime)
  router.post('/analytics/visitorType', controller.baiduAnalytics.visitorType)
  router.post('/analytics/trendLatest', controller.baiduAnalytics.trendLatest)
  router.post('/analytics/trendOnline', controller.baiduAnalytics.trendOnline)
  router.post('/analytics/sourceSite', controller.baiduAnalytics.sourceSite)
  router.post('/analytics/sourceAll', controller.baiduAnalytics.sourceAll)
  router.post('/analytics/sourceEngine', controller.baiduAnalytics.sourceEngine)
  router.post('/analytics/sourceSearchword', controller.baiduAnalytics.sourceSearchword)
  router.post('/analytics/sourceLink', controller.baiduAnalytics.sourceLink)
  router.post('/analytics/visitPage', controller.baiduAnalytics.visitPage)
  router.post('/analytics/visitToppage', controller.baiduAnalytics.visitToppage)
  router.post('/analytics/landingPage', controller.baiduAnalytics.landingPage)
  router.post('/analytics/visitLandingpage', controller.baiduAnalytics.visitLandingpage)
  router.post('/analytics/visitTopdomain', controller.baiduAnalytics.visitTopdomain)
  router.post('/analytics/visitDistrict', controller.baiduAnalytics.visitDistrict)
  router.post('/analytics/visitWorld', controller.baiduAnalytics.visitWorld)
}
