'use strict';

const { isTruthy } = require('../utils');
const { batchAdd, batchDelete } = require('../utils/batch');

const Service = require('egg').Service;

class AppNoticeService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.notice_id - id
   * @property {Number} data.notice_type - 类型 0通知 1公告
   * @property {String} data.notice_name - 名称
   * @property {String} data.notice_title - 标题
   * @property {Boolean} data.top - 置顶
   * @property {Array} data.created_range - 发布日期范围 [开始时间戳, 结束时间戳]
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async noticeList(data) {
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
    if (isTruthy(data.notice_id)) conditions.notice_id = data.notice_id;
    if (isTruthy(data.notice_type, 'zero')) conditions.notice_type = data.notice_type;
    if (isTruthy(data.notice_name)) conditions.notice_name = { $regex: data.notice_name, $options: 'i' }; // 模糊查询
    if (isTruthy(data.notice_title)) conditions.notice_title = { $regex: data.notice_title, $options: 'i' }; // 模糊查询
    if (isTruthy(data.top, 'bool')) conditions.top = data.top;
    if (isTruthy(data.created_range, 'arr')) conditions.created_date = { $gte: data.created_range[0], $lte: data.created_range[1] }; // 时间范围

    // 数据库连接
    const db = app.model.AppNotice;

    // 查询
    let query = db.find(conditions);

    // 排序：1升序，-1降序
    query = query.sort({ top: -1, created_date: -1 });

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
   * 查询有效期内的公告 - 权限 open
   * @param {Object} data - 请求参数
   * @property {Number} data.notice_type - 类型 0通知 1公告
   */
  async noticeInTime(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 查询条件处理 当前时间戳在publish_timerange[开始，结束]范围内
    const now = Date.now();
    const conditions = { $and: [{ 'publish_timerange.0': { $lte: now } }, { 'publish_timerange.1': { $gte: now } }], status: 1 };

    // 查询条件
    if (isTruthy(data.notice_type, 'zero')) conditions.notice_type = data.notice_type;

    // 数据库连接
    const db = app.model.AppNotice;

    // 查询
    let query = db.find(conditions);

    // 排序：1升序，-1降序
    query = query.sort({ top: -1, created_date: -1 });

    // 处理查询结果
    const res = await query.exec();

    return {
      data: res,
      msg: '列表获取成功',
    };
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Number} data.notice_type - 类型
   * @property {String} data.notice_name - 名称
   * @property {String} data.notice_title - 名称
   * @property {String} data.notice_content - 内容
   * @property {Array} data.publish_timerange - 时间范围
   * @property {Boolean} data.top - 置顶
   */
  async noticeAdd(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'app:notice:add' ]);

    // 参数处理
    delete data.notice_id; // 去除部分参数

    // 参数校验
    if (!isTruthy(data.notice_type, 'zero')) ctx.throw(400, { msg: 'notice_type 必填' });
    if (!isTruthy(data.notice_name)) ctx.throw(400, { msg: 'notice_name 必填' });

    // 数据库连接
    const db = app.model.AppNotice;

    // 新增
    const res = await db.create(data);

    return {
      data: res,
      msg: '新增成功',
    };
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.notice_id - id
   * @property {Number} data.notice_type - 类型
   * @property {String} data.notice_name - 名称
   * @property {String} data.notice_title - 名称
   * @property {String} data.notice_content - 内容
   * @property {Array} data.publish_timerange - 时间范围
   * @property {Boolean} data.top - 置顶
   */
  async noticeUpdate(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'app:notice:update' ]);

    // 参数校验
    if (!isTruthy(data.notice_id)) ctx.throw(400, { msg: 'notice_id 必填' });
    if (!isTruthy(data.notice_type, 'zero')) ctx.throw(400, { msg: 'notice_type 必填' });
    if (!isTruthy(data.notice_name)) ctx.throw(400, { msg: 'notice_name 必填' });

    // 查询条件处理
    const conditions = { notice_id: data.notice_id };

    // 数据库连接
    const db = app.model.AppNotice;

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
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.notice_id - id
   */
  async noticeDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'app:notice:delete' ]);

    // 参数校验
    if (!isTruthy(data.notice_id)) ctx.throw(400, { msg: 'notice_id 必填' });

    // 查询条件处理
    const conditions = { notice_id: data.notice_id };

    // 数据库连接
    const db = app.model.AppNotice;

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
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async noticeBatchAdd(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'app:notice:batchadd' ]);

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
    const db = app.model.AppNotice;

    // 主键
    const primaryKey = 'notice_id';

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey, true);

    return {
      data: res?.data,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip: res?.tip,
    };
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量删除项
   */
  async noticeBatchDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'app:notice:batchdelete' ]);

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
    const db = app.model.AppNotice;

    // 主键
    const primaryKey = 'notice_id';

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey);

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`,
    };
  }
}

module.exports = AppNoticeService;
