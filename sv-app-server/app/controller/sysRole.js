'use strict';

const Controller = require('egg').Controller;

class SysRoleController extends Controller {
  async roleList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleList(data);
    ctx.result(res);
  }

  async findPermissionByRole() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.findPermissionByRole(data);
    ctx.result(res);
  }

  async roleAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleAdd(data);
    ctx.result(res);
  }

  async roleUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleUpdate(data);
    ctx.result(res);
  }

  async roleDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleDelete(data);
    ctx.result(res);
  }

  async roleBatchAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleBatchAdd(data);
    ctx.result(res);
  }

  async roleBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysRole.roleBatchDelete(data);
    ctx.result(res);
  }
}

module.exports = SysRoleController;
