'use strict'

const Controller = require('egg').Controller

class SysUserController extends Controller {
  async userList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.userList(data)
    ctx.result(res)
  }

  async userUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.userUpdate(data)
    ctx.result(res)
  }

  async userUpdateSimple() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.userUpdateSimple(data)
    ctx.result(res)
  }

  async changeStatus() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.changeStatus(data)
    ctx.result(res)
  }

  async userDeactivate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.userDeactivate(data)
    ctx.result(res)
  }

  async userDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysUser.userDelete(data)
    ctx.result(res)
  }
}

module.exports = SysUserController
