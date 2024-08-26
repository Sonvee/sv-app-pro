'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.result({
      data: 'Hello Node',
    });
  }

  async test() {
    const { ctx } = this;
    ctx.result({
      data: 'test auth',
    });
  }
}

module.exports = HomeController;
