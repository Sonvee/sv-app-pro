'use strict';

const Controller = require('egg').Controller;

class SysUserController extends Controller {
  async userList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.userList(data);
    ctx.result(res);
  }

  async userSelf() {
    const { ctx, service } = this;
    const data = ctx.request.query;
    const res = await service.sysUser.userSelf(data);
    ctx.result(res);
  }

  async userUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.userUpdate(data);
    ctx.result(res);
  }

  async userUpdateSimple() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.userUpdateSimple(data);
    ctx.result(res);
  }

  async changePassword() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.changePassword(data);
    ctx.result(res);
  }

  async changePasswordByEmail() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.changePasswordByEmail(data);
    ctx.result(res);
  }

  async bindEmail() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.bindEmail(data);
    ctx.result(res);
  }

  async bindWechat() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.bindWechat(data);
    ctx.result(res);
  }

  async userDeactivate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.userDeactivate(data);
    ctx.result(res);
  }

  async userDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.userDelete(data);
    ctx.result(res);
  }

  async verifyVip() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysUser.verifyVip(data);
    ctx.result(res);
  }
}

module.exports = SysUserController;
