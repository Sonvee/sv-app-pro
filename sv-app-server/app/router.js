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

  // 用户体系

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
  router.post('/user/userUpdate', controller.sysUser.userUpdate)
  router.post('/user/userUpdateSimple', controller.sysUser.userUpdateSimple)
  router.post('/user/changeStatus', controller.sysUser.changeStatus)
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

  // 权限
  router.post('/user/permissionList', controller.sysPermission.permissionList)
  router.post('/user/permissionAdd', controller.sysPermission.permissionAdd)
  router.post('/user/permissionUpdate', controller.sysPermission.permissionUpdate)
  router.post('/user/permissionDelete', controller.sysPermission.permissionDelete)
  router.post('/user/permissionBatchAdd', controller.sysPermission.permissionBatchAdd)
  router.post('/user/permissionBatchDelete', controller.sysPermission.permissionBatchDelete)

  // 菜单
  router.post('/sys/menuList', controller.sysMenu.menuList)
  router.get('/sys/authMenuList', controller.sysMenu.authMenuList)
  router.post('/sys/menuAdd', controller.sysMenu.menuAdd)
  router.post('/sys/menuUpdate', controller.sysMenu.menuUpdate)
  router.post('/sys/menuDelete', controller.sysMenu.menuDelete)
  router.post('/sys/menuBatchAdd', controller.sysMenu.menuBatchAdd)
  router.post('/sys/menuBatchDelete', controller.sysMenu.menuBatchDelete)

  // 字典
  router.post('/sys/dictList', controller.sysDict.dictList)
  router.post('/sys/dictAdd', controller.sysDict.dictAdd)
  router.post('/sys/dictUpdate', controller.sysDict.dictUpdate)
  router.post('/sys/dictDelete', controller.sysDict.dictDelete)
  router.post('/sys/dictBatchAdd', controller.sysDict.dictBatchAdd)
  router.post('/sys/dictBatchDelete', controller.sysDict.dictBatchDelete)

  router.post('/sys/dictitemList', controller.sysDictitem.dictitemList)
  router.post('/sys/dictitemListByRedis', controller.sysDictitem.dictitemListByRedis)
  router.post('/sys/dictitemAdd', controller.sysDictitem.dictitemAdd)
  router.post('/sys/dictitemUpdate', controller.sysDictitem.dictitemUpdate)
  router.post('/sys/dictitemDelete', controller.sysDictitem.dictitemDelete)
  router.post('/sys/dictitemBatchAdd', controller.sysDictitem.dictitemBatchAdd)
  router.post('/sys/dictitemBatchDelete', controller.sysDictitem.dictitemBatchDelete)

  // 日志
  router.post('/sys/logList', controller.sysLog.logList)
  router.post('/sys/logDelete', controller.sysLog.logDelete)
  router.post('/sys/logBatchDelete', controller.sysLog.logBatchDelete)
  router.post('/sys/logClear', controller.sysLog.logClear)

  // 通知公告
  router.post('/sys/noticeList', controller.sysNotice.noticeList)
  router.post('/sys/noticeAdd', controller.sysNotice.noticeAdd)
  router.post('/sys/noticeUpdate', controller.sysNotice.noticeUpdate)
  router.post('/sys/noticeDelete', controller.sysNotice.noticeDelete)
  router.post('/sys/noticeBatchAdd', controller.sysNotice.noticeBatchAdd)
  router.post('/sys/noticeBatchDelete', controller.sysNotice.noticeBatchDelete)

  // 文件
  router.post('/file/avatarUpload', controller.file.avatarUpload)
  router.post('/file/avatarDelete', controller.file.avatarDelete)
  router.post('/file/userfilesDelete', controller.file.userfilesDelete)

  // 缓存
  router.get('/cache/cacheList', controller.sysCache.cacheList)
  router.post('/cache/cacheDelete', controller.sysCache.cacheDelete)
  router.post('/cache/cacheBatchDelete', controller.sysCache.cacheBatchDelete)
}