'use strict'

const { isTruthy, timeFormat } = require('../utils')

const Service = require('egg').Service

/**
 * 百度统计API手册
 * @tutorial https://tongji.baidu.com/api/manual
 */
class BaiduAnalyticsService extends Service {
  /**
   * 获取token验证码code
   */
  async baiduTokenCode(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    const url = `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=${app.config.baiduAnalytics.api_key}&redirect_uri=oob&scope=basic&display=popup`

    return {
      data: url
    }
  }

  /**
   * 根据code获取token
   * @description 正常情况只需获取一次，之后请使用refreshBaiduToken更新token
   * @param {Object} data 请求参数
   * @property {String} data.code 用于获取token的code
   */
  async baiduTokenByCode(data) {
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
  async siteList(data) {
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

    return {
      data: res.data,
      msg: '获取站点列表成功'
    }
  }

  /**
   * 报告数据 - 网站概况 (今日流量)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/getData.html
   * @param {Object} data 请求参数
   */
  async outline(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'overview/getOutline',
        access_token: data.access_token,
        site_id: data.site_id
      }
    })

    return {
      data: res.data,
      msg: '获取今日流量数据成功'
    }
  }

  /**
   * 报告数据 - 网站概况 (趋势数据)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getTimeTrendRpt.html
   * @param {Object} data 请求参数
   */
  async timeTrendRpt(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
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
  async districtRpt(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取趋势数据成功'
    }
  }

  /**
   * 报告数据 - 网站概况 (来源网站、搜索词、入口页面、受访页面 - 总览)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getCommonTrackRpt.html
   * @param {Object} data 请求参数
   */
  async commonTrackRpt(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
    if (!isTruthy(data.date_range, 'arr')) ctx.throw(400, { msg: 'date_range 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'overview/getCommonTrackRpt',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取趋势数据成功'
    }
  }

  /**
   * 报告数据 - 访客属性 (年龄分布)
   * @param {Object} data 请求参数
   */
  async overviewAge(data) {
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
        method: 'overview/getAge',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data?.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取访客属性年龄分布数据成功'
    }
  }

  /**
   * 报告数据 - 趋势分析
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/trend_time_a.html
   * @param {Object} data 请求参数
   */
  async trendTime(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
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
   * 报告数据 - 实时访客 (新老访客)
   * @param {Object} data 请求参数
   */
  async visitorType(data) {
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
        method: 'overview/getVisitorType',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data?.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取新老访客数据成功'
    }
  }

  /**
   * 报告数据 - 实时访客
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/trend_latest_a.html
   * @param {Object} data 请求参数
   */
  async trendLatest(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
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
   * 报告数据 - 在线访客
   * @param {Object} data 请求参数
   */
  async trendOnline(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })

    const url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData'
    const res = await ctx.curl(url, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        method: 'trend/latest/f',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data.metrics,
      }
    })

    return {
      data: res.data,
      msg: '获取在线访客数据成功'
    }
  }

  /**
   * 报告数据 - 全部来源(来源网站) overview版 (metrics只有一个pv_count指标)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getCommonTrackRpt.html
   * @param {Object} data 请求参数
   */
  async sourceSite(data) {
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
        method: 'overview/getSourceSite',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data?.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
        viewType: data?.viewType,
        clientDevice: data?.clientDevice,
        visitor: data?.visitor
      }
    })

    return {
      data: res.data,
      msg: '获取来源网站数据成功'
    }
  }

  /**
   * 报告数据 - 全部来源(来源网站) source版
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/source_all_a.html
   * @param {Object} data 请求参数
   */
  async sourceAll(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
        viewType: data?.viewType,
        clientDevice: data?.clientDevice,
        visitor: data?.visitor
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
  async sourceEngine(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
        clientDevice: data?.clientDevice,
        area: data?.area,
        visitor: data?.visitor
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
  async sourceSearchword(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
        source: data?.source,
        clientDevice: data?.clientDevice,
        visitor: data?.visitor
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
  async sourceLink(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results,
        // 其他参数
        viewType: data?.viewType,
        domainType: data?.domainType,
        clientDevice: data?.clientDevice,
        visitor: data?.visitor
      }
    })

    return {
      data: res.data,
      msg: '获取外部链接数据成功'
    }
  }

  /**
   * 报告数据 - 受访页面 overview版 (metrics只有一个pv_count指标)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getCommonTrackRpt.html
   * @param {Object} data 请求参数
   */
  async visitPage(data) {
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
        method: 'overview/getVisitPage',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data?.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取受访页面数据成功'
    }
  }

  /**
   * 报告数据 - 受访页面 visit版
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_toppage_a.html
   * @param {Object} data 请求参数
   */
  async visitToppage(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取受访页面数据成功'
    }
  }

  /**
   * 报告数据 - 入口页面 overview版 (metrics只有一个pv_count指标)
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/overview_getCommonTrackRpt.html
   * @param {Object} data 请求参数
   */
  async landingPage(data) {
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
        method: 'overview/getLandingPage',
        access_token: data.access_token,
        site_id: data.site_id,
        metrics: data?.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取入口页面数据成功'
    }
  }

  /**
   * 报告数据 - 入口页面 visit版
   * @tutorial https://tongji.baidu.com/api/manual/Chapter1/visit_landingpage_a.html
   * @param {Object} data 请求参数
   */
  async visitLandingpage(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
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
  async visitTopdomain(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
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
  async visitDistrict(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
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
  async visitWorld(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:analytics:query'])

    // 参数校验
    if (!isTruthy(data.access_token)) ctx.throw(400, { msg: 'access_token 必填' })
    if (!isTruthy(data.site_id)) ctx.throw(400, { msg: 'site_id 必填' })
    if (!isTruthy(data.metrics)) ctx.throw(400, { msg: 'metrics 必填' })
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
        metrics: data.metrics,
        start_date: timeFormat(data.date_range[0], 'YYYYMMDDHHmmss'),
        end_date: timeFormat(data.date_range[1], 'YYYYMMDDHHmmss'),
        // 可选基本参数
        start_date2: timeFormat(data?.date_range2 && data?.date_range2[0], 'YYYYMMDDHHmmss'),
        end_date2: timeFormat(data?.date_range2 && data?.date_range2[1], 'YYYYMMDDHHmmss'),
        order: data?.order,
        start_index: data?.start_index,
        max_results: data?.max_results
      }
    })

    return {
      data: res.data,
      msg: '获取地域分布(按国家)数据成功'
    }
  }
}

module.exports = BaiduAnalyticsService
