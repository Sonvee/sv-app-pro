'use strict';

const Controller = require('egg').Controller;

class SysMenuController extends Controller {
  async menuList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuList(data);
    ctx.result(res);
  }

  async authMenuList() {
    const { ctx, service } = this;
    const res = await service.sysMenu.authMenuList();
    ctx.result(res);
  }

  async menuAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuAdd(data);
    ctx.result(res);
  }

  async menuUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuUpdate(data);
    ctx.result(res);
  }

  async menuDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuDelete(data);
    ctx.result(res);
  }

  async menuBatchAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuBatchAdd(data);
    ctx.result(res);
  }

  async menuBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysMenu.menuBatchDelete(data);
    ctx.result(res);
  }
}

module.exports = SysMenuController;
