'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

/**
 * 百度统计API手册
 * @tutorial https://tongji.baidu.com/api/manual
 */
class BaiduAnalyticsService extends Service {
  /**
   * 获取token验证码code
   */
  async getBaiduTokenCode(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    const url = `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=${app.config.baiduAnalytics.api_key}&redirect_uri=oob&scope=basic&display=popup`

    return {
      data: url
    }
  }

  async getBaiduTokenByCode(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.code)) ctx.throw(400, { msg: 'code 必填' })

    const url = 'http://openapi.baidu.com/oauth/2.0/token'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        grant_type: 'authorization_code',
        code: data.code,
        client_id: app.config.baiduAnalytics.api_key,
        client_secret: app.config.baiduAnalytics.secret_key,
        redirect_uri: 'oob'
      }
    })

    if (res.status !== 200) ctx.throw(400, { msg: res.data.error_description, errMsg: res.data })

    return {
      data: res.data,
      msg: '百度统计token获取成功，请保管好refresh_token和access_token'
    }
  }

  /**
   * 刷新百度统计token
   * @tutorial https://tongji.baidu.com/api/manual/Chapter2/openapi.html 如何获取refresh_token
   * @param {Object} data 请求参数
   * @property {String} data.refresh_token 使用refresh_token刷新获取新的refresh_token及access_token
   * @returns {Object} refresh_token(有效期十年)，access_token(有效期一个月)
   */
  async refreshBaiduToken(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.refresh_token)) ctx.throw(400, { msg: 'refresh_token 必填' })

    const url = 'http://openapi.baidu.com/oauth/2.0/token'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        grant_type: 'refresh_token',
        refresh_token: data.refresh_token,
        client_id: app.config.baiduAnalytics.api_key,
        client_secret: app.config.baiduAnalytics.secret_key
      }
    })

    return {
      data: res.data,
      msg: '百度统计token更新成功，请保管好refresh_token和access_token'
    }
  }

  /**
   * 站点列表
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/getSiteList.html
   * @param {Object} data 请求参数
   */
  async getSiteList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/config/getSiteList'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        access_token: data.access_token
      }
    })

    if (res.data.error_code) ctx.throw(400, { msg: res.data.error_msg, errMsg: res.data })

    console.log('res :>> ', res)

    return {
      data: res.data,
      msg: '获取站点列表成功'
    }
  }

  /**
   * 报告数据 - 网站概况 (趋势数据)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getTimeTrendRpt.html
   * @param {Object} data 请求参数
   */
  async getTimeTrendRpt(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'overview/getTimeTrendRpt',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取趋势数据成功'
    }
  }

  /**
   * 报告数据 - 网站概况 (地域分布)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getDistrictRpt.html
   * @param {Object} data 请求参数
   */
  async getDistrictRpt(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'overview/getDistrictRpt',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取趋势数据成功'
    }
  }

  /**
   * 报告数据 - 趋势分析
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/trend_time_a.html
   * @param {Object} data 请求参数
   */
  async getTrendTime(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'trend/time/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics,
        gran: data.gran,
        source: data?.source,
        clientDevice: data?.clientDevice,
        area: data?.area,
        visitor: data?.visitor
      }
    })

    return {
      data: res.data,
      msg: '获取趋势分析数据成功'
    }
  }

  /**
   * 报告数据 - 实时访客
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/trend_latest_a.html
   * @param {Object} data 请求参数
   */
  async getTrendLatest(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'trend/latest/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics,
        order: 'visit_pages,desc',
        max_results: '100',
        source: data?.source,
        clientDevice: data?.clientDevice,
        area: data?.area,
        visitor: data?.visitor
      }
    })

    return {
      data: res.data,
      msg: '获取实时访客数据成功'
    }
  }

  /**
   * 报告数据 - 全部来源
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/source_all_a.html
   * @param {Object} data 请求参数
   */
  async getSourceAll(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'source/all/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取全部来源数据成功'
    }
  }

  /**
   * 报告数据 - 搜索引擎
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/source_engine_a.html
   * @param {Object} data 请求参数
   */
  async getSourceEngine(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'source/engine/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取搜索引擎数据成功'
    }
  }

  /**
   * 报告数据 - 搜索词
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/source_searchword_a.html
   * @param {Object} data 请求参数
   */
  async getSourceSearchword(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'source/searchword/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取搜索词数据成功'
    }
  }

  /**
   * 报告数据 - 外部链接
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/source_link_a.html
   * @param {Object} data 请求参数
   */
  async getSourceLink(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'source/link/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取外部链接数据成功'
    }
  }

  /**
   * 报告数据 - 受访页面
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_toppage_a.html
   * @param {Object} data 请求参数
   */
  async getVisitToppage(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'visit/toppage/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取受访页面数据成功'
    }
  }

  /**
   * 报告数据 - 入口页面
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_landingpage_a.html
   * @param {Object} data 请求参数
   */
  async getVisitLandingpage(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'visit/landingpage/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取入口页面数据成功'
    }
  }

  /**
   * 报告数据 - 受访域名
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_topdomain_a.html
   * @param {Object} data 请求参数
   */
  async getVisitTopdomain(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'visit/topdomain/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取受访域名数据成功'
    }
  }

  /**
   * 报告数据 - 地域分布(按省)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_district_a.html
   * @param {Object} data 请求参数
   */
  async getVisitDistrict(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'visit/district/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取地域分布(按省)数据成功'
    }
  }

  /**
   * 报告数据 - 地域分布(按省)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_world_a.html
   * @param {Object} data 请求参数
   */
  async getVisitWorld(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'visit/world/a',
        access_token: data.access_token,
        site_id: data.site_id,
        start_date: data.date_range[0],
        end_date: data.date_range[1],
        metrics: data?.metrics
      }
    })

    return {
      data: res.data,
      msg: '获取地域分布(按国家)数据成功'
    }
  }
}

module.exports = BaiduAnalyticsService