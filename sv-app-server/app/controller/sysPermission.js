'use strict'

const Controller = require('egg').Controller

class SysPermissionController extends Controller {
  async permissionList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionList(data)
    ctx.result(res)
  }

  async permissionAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionAdd(data)
    ctx.result(res)
  }

  async permissionUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionUpdate(data)
    ctx.result(res)
  }

  async permissionDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionDelete(data)
    ctx.result(res)
  }

  async permissionBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionBatchAdd(data)
    ctx.result(res)
  }

  async permissionBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionBatchDelete(data)
    ctx.result(res)
  }

  async permissionExcelTemplate() {
    const { ctx, service } = this
    const res = await service.sysPermission.permissionExcelTemplate()
    ctx.result(res)
  }

  async permissionImport() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.sysPermission.permissionImport({ data, files })
    ctx.result(res)
  }

  async permissionExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysPermission.permissionExport(data)
    ctx.result(res)
  }
}

module.exports = SysPermissionController
