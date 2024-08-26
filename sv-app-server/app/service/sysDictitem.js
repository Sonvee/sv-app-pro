'use strict';

const { isTruthy } = require('../utils');
const { batchDelete, batchAddX } = require('../utils/batch');

const Service = require('egg').Service;

class SysDictitemService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async dictitemList(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('open');

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data;
    pagesize = Number(pagesize);
    pagenum = Number(pagenum);

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' });

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' });

    // dict_type正确性校验
    const hasDict = await app.model.SysDict.findOne({ dict_id: data.dict_type });
    if (!hasDict) ctx.throw(400, { msg: `${data.dict_type} 不存在` });

    // 查询条件处理
    const conditions = { dict_type: data.dict_type };

    // 查询条件
    if (isTruthy(data.dict_type)) conditions.dict_type = data.dict_type;
    if (isTruthy(data.label)) conditions.label = { $regex: data.label, $options: 'i' }; // 模糊查询
    if (isTruthy(data.value)) conditions.value = { $regex: data.value, $options: 'i' }; // 模糊查询

    // 数据库连接
    const db = app.model.SysDictitem;

    // 查询
    let query = db.find(conditions);

    // 排序：1升序，-1降序
    query = query.sort({ sort: 1 });

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

    // redis缓存
    if (data.pagesize == -1 && isTruthy(data.dict_type)) {
      await app.redis.set(`dict:${data.dict_type}`, JSON.stringify(res));
    }

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
   * Redis查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   */
  async dictitemListByRedis(data) {
    const { ctx, app } = this;

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' });

    const dictRedis = await app.redis.get(`dict:${data.dict_type}`);
    if (dictRedis) {
      return {
        data: JSON.parse(dictRedis),
        msg: 'Redis字典列表获取成功',
      };
    }
    data.pagesize = -1;
    const { data: res } = await this.dictitemList(data);
    return {
      data: res,
      msg: '字典列表获取成功',
    };

  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {String} data.remark - 备注
   * @property {Number} data.sort - 排序
   */
  async dictitemAdd(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'sys:dictitem:add' ]);

    // 参数处理
    delete data._id; // 去除部分参数

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' });
    if (!isTruthy(data.label)) ctx.throw(400, { msg: 'label 必填' });
    if (!isTruthy(data.value)) ctx.throw(400, { msg: 'value 必填' });

    // 绑定校验
    const hasDict = await app.model.SysDict.findOne({ dict_id: data.dict_type });
    if (!hasDict) ctx.throw(400, { msg: `${data.dict_type} 不存在` });

    // 数据库连接
    const db = app.model.SysDictitem;

    // 新增
    const res = await db.create(data);

    // 删除redis缓存
    app.redis.del(`dict:${data.dict_type}`);

    return {
      data: res,
      msg: '新增成功',
    };
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dictitem_id - 字典项id
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {String} data.remark - 备注
   * @property {Number} data.sort - 排序
   */
  async dictitemUpdate(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'sys:dictitem:update' ]);

    // 参数校验
    if (!isTruthy(data.dictitem_id)) ctx.throw(400, { msg: 'dictitem_id 必填' });

    // 查询条件处理
    const conditions = { dictitem_id: data.dictitem_id };

    // 数据库连接
    const db = app.model.SysDictitem;

    // 查询
    const one = await db.findOne(conditions);
    if (!one) ctx.throw(400, { msg: '更新项不存在' });

    const res = await db.findOneAndUpdate(conditions, data, { new: true });

    // 删除redis缓存
    app.redis.del(`dict:${one.dict_type}`);

    return {
      data: res,
      msg: '更新成功',
    };
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dictitem_id - 字典项id
   */
  async dictitemDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'sys:dictitem:delete' ]);

    // 参数校验
    if (!isTruthy(data.dictitem_id)) ctx.throw(400, { msg: 'dictitem_id 必填' });

    // 查询条件处理
    const conditions = { dictitem_id: data.dictitem_id };

    // 数据库连接
    const db = app.model.SysDictitem;

    // 查询
    const one = await db.findOne(conditions);
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' });

    const res = await db.deleteOne(conditions);

    // 删除redis缓存
    app.redis.del(`dict:${one.dict_type}`);

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
  async dictitemBatchAdd(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'sys:dictitem:batchadd' ]);

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
    const db = app.model.SysDictitem;

    // 主键
    const primaryKey = 'dictitem_id';
    // 副键
    const secondaryKey = 'dict_type';
    // 次键
    const tertiaryKey = 'label';

    const res = await batchAddX(ctx, db, data, primaryKey, secondaryKey, tertiaryKey);

    // 清空这些字典类型缓存，以重新更新
    res.existingTypes?.forEach(item => {
      app.redis.del(`dict:${item}`);
    });

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
  async dictitemBatchDelete(data) {
    const { ctx, app } = this;

    // 权限校验
    ctx.checkAuthority('permission', [ 'sys:dictitem:batchdelete' ]);

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
    const db = app.model.SysDictitem;

    // 主键
    const primaryKey = 'dictitem_id';

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey);

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`,
    };
  }
}

module.exports = SysDictitemService;
