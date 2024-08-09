'use strict'

const Service = require('egg').Service
const svgCaptcha = require('svg-captcha')
const nodemailer = require('nodemailer')
const { generateRandomCode, isTruthy } = require('../utils')
const useRegExp = require('../utils/regexp')
const useThrottle = require('../utils/throttle')
const useLimit = require('../utils/limit')

class SysAuthService extends Service {
  /**
   * 获取图形验证码 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.type - 类型：register注册，login登录，sms短信验证，email邮件验证，verify其他验证
   */
  async getCaptcha(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 限流阀
    await useLimit({ ctx, key: 'limit:captcha', threshold: 20, unlock: 10 })

    // type参数校验
    const types = ['register', 'login', 'sms', 'email', 'verify']
    if (!types.includes(data.type)) ctx.throw(400, { msg: 'type 类型无效' })

    // 缓存参数设置
    const ip = ctx.request.ip
    const captchaKey = `captcha:${ip}:${data.type}:code`

    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      noise: 2, // 干扰线条的数量
      width: 100,
      height: 40,
      fontSize: 50,
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: 'transparent', // 验证码图片背景颜色
      ignoreChars: '0Oo1LlIiJjTtabPpQq' // 验证码字符中排除指定容易混淆的字符
    })

    // 缓存验证码
    await app.redis.set(captchaKey, captcha.text, 'EX', 600) // 过期时间10分钟

    // 将 SVG 字符串转换为 dataURI
    const createDataUri = (svgContent) => {
      const encodedSvg = btoa(
        encodeURIComponent(svgContent).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode('0x' + p1)
        })
      )
      return `data:image/svg+xml;base64,${encodedSvg}`
    }

    return {
      data: createDataUri(captcha.data),
      msg: '验证码获取成功'
    }
  }

  /**
   * 邮箱验证码 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.email - 用户名
   * @property {String} data.type - 类型：login登录 | bind绑定 | verify其他验证；（验证码没有注册，登录即注册）
   */
  async emailCaptcha(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // email格式校验
    const emailRegExp = useRegExp('email')
    if (!emailRegExp.regexp.test(data.email)) ctx.throw(400, { msg: emailRegExp.msg })
    // type参数校验
    const types = ['login', 'bind', 'verify']
    if (!types.includes(data.type)) ctx.throw(400, { msg: 'type 类型无效' })

    // 节流阀
    await useThrottle({ ctx, key: `emailcaptcha:${data.email}:${data.type}:throttle`, time: 60 })

    // 生成验证码
    const captcha = generateRandomCode(6) // 6位随机码，区分大小写

    // 缓存验证码
    const captchaKey = `emailcaptcha:${data.email}:${data.type}:code` // 验证码key
    await app.redis.set(captchaKey, captcha, 'EX', app.config.nodemailer.expires * 60) // 缓存验证码

    // 邮件参数
    let mailOptions = {
      from: app.config.nodemailer.default.auth.user, // 发件人地址
      to: data.email, //  收件人地址，多个收件人可以使用逗号分隔
      subject: '邮箱验证码', // 邮件标题
      html: `
            <div style="width: 520px; margin: 0 auto; font-size: 24px; border: 1px solid #cccccc; padding: 12px 32px">
              <p>
                <strong>尊敬的用户：</strong>
              </p>
              <p>
                <span style="font-size: 20px">您正在获取身份验证：</span>
                <strong style="color: #409eff; background-color: #dddddd44; box-shadow: 0 0 12px #eeeeee66; font-size: 28px; padding: 4px 8px; border-radius: 4px">${captcha}</strong>
              </p>
              <p style="font-size: 20px; color: #909399">该验证码&nbsp;<span style="color: #67c23a">${app.config.nodemailer.expires}&nbsp;分钟</span>&nbsp;内有效，请勿泄漏！</p>
              <p style="font-size: 18px; color: #747474">
                <span style="color: #f56c6c">注意：</span>
                <br />
                此操作可能会修改您的密码、登录邮箱或绑定账号等。
                <br />
                如非本人操作，请及时登录并修改密码以保证帐户安全。
              </p>
              <hr style="margin: 20px 0; background-color: #cccccc; height: 1px; border: none" />
              <p style="font-size: 18px; color: #747474">
                此为系统邮件，请勿回复。
                <br />
                请保管好您的邮箱，避免账号被他人盗用。
              </p>
              <p style="font-size: 20px; text-align: end">SV团队</p>
            </div>
            `
    }

    // 开始生成邮件
    const transporter = nodemailer.createTransport(app.config.nodemailer.default)
    // 发送
    const sendRes = await transporter.sendMail(mailOptions)

    return {
      data: sendRes,
      msg: '邮件发送成功'
    }
  }
}

module.exports = SysAuthService
