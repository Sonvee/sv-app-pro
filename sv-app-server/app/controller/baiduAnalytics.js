'use strict'

const Controller = require('egg').Controller

class BaiduAnalyticsController extends Controller {
  async baiduTokenCode() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.baiduTokenCode(data)
    ctx.result(res)
  }

  async baiduTokenByCode() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.baiduTokenByCode(data)
    ctx.result(res)
  }

  async refreshBaiduToken() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.refreshBaiduToken(data)
    ctx.result(res)
  }

  async siteList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.siteList(data)
    ctx.result(res)
  }

  async outline() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.outline(data)
    ctx.result(res)
  }

  async timeTrendRpt() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.timeTrendRpt(data)
    ctx.result(res)
  }

  async districtRpt() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.districtRpt(data)
    ctx.result(res)
  }

  async commonTrackRpt() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.commonTrackRpt(data)
    ctx.result(res)
  }

  async overviewAge() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.overviewAge(data)
    ctx.result(res)
  }

  async trendTime() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.trendTime(data)
    ctx.result(res)
  }

  async visitorType() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitorType(data)
    ctx.result(res)
  }

  async trendLatest() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.trendLatest(data)
    ctx.result(res)
  }

  async sourceSite() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.sourceSite(data)
    ctx.result(res)
  }

  async sourceAll() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.sourceAll(data)
    ctx.result(res)
  }

  async sourceEngine() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.sourceEngine(data)
    ctx.result(res)
  }

  async sourceSearchword() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.sourceSearchword(data)
    ctx.result(res)
  }

  async sourceLink() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.sourceLink(data)
    ctx.result(res)
  }

  async visitPage() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitPage(data)
    ctx.result(res)
  }

  async visitToppage() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitToppage(data)
    ctx.result(res)
  }

  async landingPage() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.landingPage(data)
    ctx.result(res)
  }

  async visitLandingpage() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitLandingpage(data)
    ctx.result(res)
  }

  async visitTopdomain() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitTopdomain(data)
    ctx.result(res)
  }

  async visitDistrict() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitDistrict(data)
    ctx.result(res)
  }

  async visitWorld() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.baiduAnalytics.visitWorld(data)
    ctx.result(res)
  }
}

module.exports = BaiduAnalyticsController
