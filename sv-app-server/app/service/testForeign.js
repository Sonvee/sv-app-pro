'use strict';

const { isTruthy } = require('../utils');
const { batchAdd, batchDelete } = require('../utils/batch');

const Service = require('egg').Service;

class TestForeignService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.testforeign_id - id
   * @property {String} data.testforeign_name - 名称
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async testforeignList(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data;
    pagesize = Number(pagesize);
    pagenum = Number(pagenum);

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' });

    // 查询条件处理
    const conditions = {};

    // 查询条件
    if (isTruthy(data.testforeign_id)) conditions.testforeign_id = data.testforeign_id;
    if (isTruthy(data.testforeign_name)) conditions.testforeign_name = { $regex: data.testforeign_name, $options: 'i' }; // 模糊查询

    // 数据库连接
    const db = app.model.TestForeign;

    // 查询
    let query = db.find(conditions);

    // 排序：1升序，-1降序
    query = query.sort({ created_date: -1 }); // 按照创建时间倒序

    // 分页
    if (pagesize > 0) {
      query = query.skip(pagesize * (pagenum - 1)).limit(pagesize);
    }

    // 计数
    const count = await db.countDocuments(conditions);

    // 页数
    const pages = pagesize > 0 ? Math.ceil(count / pagesize) : count > 0 ? 1 : 0;

    // 处理查询结果
    const res = await query.exec();

    return {
      data: res,
      msg: '列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages,
    };
  }

  /**
   * 新增 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.testforeign_id - id
   * @property {String} data.testforeign_name - 名称
   */
  async testforeignAdd(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数校验
    if (!isTruthy(data.testforeign_id)) ctx.throw(400, { msg: 'testforeign_id 必填' });

    // 查询条件处理
    const conditions = { testforeign_id: data.testforeign_id };

    // 数据库连接
    const db = app.model.TestForeign;

    // 查询
    const one = await db.findOne(conditions);
    if (one) ctx.throw(400, { msg: '新增项已存在' });

    const res = await db.create(data);

    return {
      data: res,
      msg: '新增成功',
    };
  }

  /**
   * 更新 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.testforeign_id - id
   * @property {String} data.testforeign_name - 名称
   */
  async testforeignUpdate(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数校验
    if (!isTruthy(data.testforeign_id)) ctx.throw(400, { msg: 'testforeign_id 必填' });

    // 查询条件处理
    const conditions = { testforeign_id: data.testforeign_id };

    // 数据库连接
    const db = app.model.TestForeign;

    // 查询
    const one = await db.findOne(conditions);
    if (!one) ctx.throw(400, { msg: '更新项不存在' });

    const res = await db.findOneAndUpdate(conditions, data, { new: true });

    return {
      data: res,
      msg: '更新成功',
    };
  }

  /**
   * 删除 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.testforeign_id - id
   */
  async testforeignDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数校验
    if (!isTruthy(data.testforeign_id)) ctx.throw(400, { msg: 'testforeign_id 必填' });

    // 查询条件处理
    const conditions = { testforeign_id: data.testforeign_id };

    // 数据库连接
    const db = app.model.TestForeign;

    // 查询
    const one = await db.findOne(conditions);
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' });

    const res = await db.deleteOne(conditions);

    return {
      data: res,
      msg: '删除成功',
    };
  }

  /**
   * 批量新增 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async testforeignBatchAdd(data) {
    const { ctx, app } = this;

    // 参数处理
    data = Object.assign(
      {
        list: [],
        cover: false, // 是否覆盖
      },
      data
    );

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' });
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' });

    // 数据库连接
    const db = app.model.TestForeign;

    // 主键
    const primaryKey = 'testforeign_id';

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey);

    let msg = data.cover ? '批量覆盖添加成功' : '批量增量添加成功'
    if (!isTruthy(res?.data, 'arrobj')) msg += ' - 无有效数据项添加'

    return {
      data: res?.data,
      msg: msg,
      tip: res?.tip
    }
  }

  /**
   * 批量删除 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量删除项
   */
  async testforeignBatchDelete(data) {
    const { ctx, app } = this;

    // 参数处理
    data = Object.assign(
      {
        list: [], // 需要删除的记录的ID列表
      },
      data
    );

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' });
    if (!isTruthy(data.list)) ctx.throw(400, { msg: 'list 为空' });

    // 数据库连接
    const db = app.model.TestForeign;

    // 主键
    const primaryKey = 'testforeign_id';

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey);

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`,
    };
  }
}

module.exports = TestForeignService;
