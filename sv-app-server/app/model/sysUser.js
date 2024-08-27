'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const SysUserSchema = new mongoose.Schema(
    {
      // 主键 - 用户id
      user_id: {
        type: String,
        unique: true,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      // 副键 - 用户名
      username: {
        type: String,
        unique: true,
        required: true,
      },
      // 密码
      password: {
        type: String,
      },
      // 昵称
      nickname: {
        type: String,
      },
      // 头像
      avatar: {
        type: Object,
      },
      // 手机
      phone: {
        type: String,
      },
      // 邮箱
      email: {
        type: String,
      },
      // 角色
      role: {
        type: Array,
      },
      // 性别
      gender: {
        type: Number,
      },
      // 备注
      comment: {
        type: String,
      },
      // 生日
      birthday: {
        type: Number,
      },
      // 部门
      department_id: {
        type: String,
      },
      // 标签
      tags: {
        type: Array,
      },
      // 积分
      score: {
        type: Number,
      },
      // 状态 0:禁用 1:正常 2:注销
      status: {
        type: Number,
      },
      // token
      token: {
        type: String,
      },
      // 邀请人
      inviter_uid: {
        type: String,
      },
      // 邀请码
      my_invite_code: {
        type: String,
      },
      // 实名认证
      realname_auth: {
        type: Array,
      },
      // 注册ip
      register_ip: {
        type: String,
      },
      // 注册时间
      register_date: {
        type: Number,
      },
      // 注册平台
      register_platform: {
        type: String,
      },
      // 登录ip
      login_ip: {
        type: String,
      },
      // 登录时间
      login_date: {
        type: Number,
      },
      // 登录平台
      login_platform: {
        type: String,
      },
      // 微信openid 腾讯公共平台
      wx_openid: {
        type: String,
      },
      // 微信unionid 腾讯开放平台
      wx_unionid: {
        type: String,
      },
      // 微信会话密钥，会过期
      wx_session_key: {
        type: String,
      },
      // 第三方登录凭证
      third_party: {
        type: Object,
      },
      // 自动生成字段
      created_date: {
        type: Number,
      },
      updated_date: {
        type: Number,
      },
    },
    {
      versionKey: false, // 去除版本号字段
      timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
    }
  );

  return mongoose.model('sys_user', SysUserSchema);
};
