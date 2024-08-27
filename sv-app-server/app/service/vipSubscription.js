'use strict';

const { isTruthy } = require('../utils');
const { batchDelete } = require('../utils/batch');

const Service = require('egg').Service;

class VipSubscriptionService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.subscription_id - id
   * @property {String} data.subscription_plan - 套餐id
   * @property {String} data.user_id - 用户id
   * @property {Number} data.status - 状态
   * @property {Number} data.type - 订阅类型
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async subscriptionList(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data;
    pagesize = Number(pagesize);
    pagenum = Number(pagenum);

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' });

    // 查询条件处理
    const conditions = {};

    // 查询条件
    if (isTruthy(data.subscription_id)) conditions.subscription_id = data.subscription_id;
    if (isTruthy(data.user_id)) conditions.user_id = data.user_id;
    if (isTruthy(data.subscription_plan)) conditions.subscription_plan = data.subscription_plan;
    if (isTruthy(data.status, 'zero')) conditions.status = data.status;
    if (isTruthy(data.type, 'zero')) conditions.type = data.type;

    // 数据库连接
    const db = app.model.VipSubscription;

    // 聚合联表查询操作
    let query = db.aggregate([
      { $match: conditions },
      {
        // 联表
        $lookup: {
          from: 'vip_plans', // 这里需要是集合名，不是模型名
          localField: 'subscription_plan', // 这里的字段名需要和Schema中指定键名匹配
          foreignField: 'plan_id', // 这里的字段名需要和Schema中指定键的ref匹配
          as: 'subscription_plan_detail', // 自定义输出字段名
          pipeline: [
            {
              // 联表指定字段：0 不显示，1 显示
              $project: {
                _id: 0,
                plan_id: 1,
                plan_name: 1,
                valid_day: 1,
              },
            },
          ],
        },
      },
      {
        // 数组严禁使用$unwind，会展开为单个对象
        $unwind: {
          path: '$subscription_plan_detail',
          preserveNullAndEmptyArrays: true, // 必须开启，否则其他为空的数据项将不会被查询
        },
      },
      {
        // 联表
        $lookup: {
          from: 'sys_users', // 这里需要是集合名，不是模型名
          localField: 'user_id', // 这里的字段名需要和Schema中指定键名匹配
          foreignField: 'username', // 这里的字段名需要和Schema中指定键的ref匹配
          as: 'user_detail', // 自定义输出字段名
          pipeline: [
            {
              // 联表指定字段：0 不显示，1 显示
              $project: {
                _id: 0,
                user_id: 1,
                username: 1,
                nickname: 1,
                phone: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        // 数组严禁使用$unwind，会展开为单个对象
        $unwind: {
          path: '$user_detail',
          preserveNullAndEmptyArrays: true, // 必须开启，否则其他为空的数据项将不会被查询
        },
      },
      { $sort: { created_date: -1 } }, // 排序：1升序，-1降序
    ]);

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
      msg: '订阅列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages,
    };
  }

  /**
   * 新增 post - 权限 self
   * @param {Object} data - 请求参数
   * @property {String} data.user_id - 用户id
   * @property {String} data.subscription_plan - 套餐id
   */
  async subscriptionAdd(data) {
    const { ctx, app } = this;

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' });

    // 权限校验
    ctx.checkAuthority('self', data.user_id);

    // 参数校验
    if (!isTruthy(data.subscription_plan)) ctx.throw(400, { msg: 'subscription_plan 必填' });

    // 套餐查询
    const onePlan = await app.model.VipPlan.findOne({ plan_id: data.subscription_plan });
    if (!onePlan) ctx.throw(400, { msg: '套餐不存在' });

    // 数据库连接
    const db = app.model.VipSubscription;

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
   * @property {String} data.subscription_id - id
   * @property {String} data.user_id - 用户id
   */
  async subscriptionUpdate(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'vip:subscription:update' ]);

    // 参数校验
    if (!isTruthy(data.subscription_id)) ctx.throw(400, { msg: 'subscription_id 必填' });

    // 查询条件处理
    const conditions = { subscription_id: data.subscription_id };

    // 数据库连接
    const db = app.model.VipSubscription;

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
   * @property {String} data.subscription_id - id
   */
  async subscriptionDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'vip:subscription:delete' ]);

    // 参数校验
    if (!isTruthy(data.subscription_id)) ctx.throw(400, { msg: 'subscription_id 必填' });

    // 查询条件处理
    const conditions = { subscription_id: data.subscription_id };

    // 数据库连接
    const db = app.model.VipSubscription;

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
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   */
  async subscriptionBatchDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'vip:subscription:batchdelete' ]);

    // 参数处理
    data = Object.assign(
      {
        list: [], // 需要删除的记录的ID列表
      },
      data
    );

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' });
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' });

    // 数据库连接
    const db = app.model.VipSubscription;

    // 主键
    const primaryKey = 'subscription_id';

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey);

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`,
    };
  }
}

module.exports = VipSubscriptionService;
