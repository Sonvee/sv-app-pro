'use strict'

const Controller = require('egg').Controller

class BaiduAnalyticsController extends Controller {
  async getBaiduTokenCode() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getBaiduTokenCode(data)
    ctx.result(res)
  }

  async getBaiduTokenByCode() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getBaiduTokenByCode(data)
    ctx.result(res)
  }

  async refreshBaiduToken() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.refreshBaiduToken(data)
    ctx.result(res)
  }

  async getSiteList() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getSiteList(data)
    ctx.result(res)
  }

  async getOutline() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getOutline(data)
    ctx.result(res)
  }

  async getTimeTrendRpt() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getTimeTrendRpt(data)
    ctx.result(res)
  }

  async getDistrictRpt() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getDistrictRpt(data)
    ctx.result(res)
  }

  async getCommonTrackRpt() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getCommonTrackRpt(data)
    ctx.result(res)
  }

  async getTrendTime() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getTrendTime(data)
    ctx.result(res)
  }

  async getTrendLatest() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getTrendLatest(data)
    ctx.result(res)
  }

  async getSourceAll() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getSourceAll(data)
    ctx.result(res)
  }

  async getSourceEngine() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getSourceEngine(data)
    ctx.result(res)
  }

  async getSourceSearchword() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getSourceSearchword(data)
    ctx.result(res)
  }

  async getSourceLink() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getSourceLink(data)
    ctx.result(res)
  }

  async getVisitToppage() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getVisitToppage(data)
    ctx.result(res)
  }

  async getVisitLandingpage() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getVisitLandingpage(data)
    ctx.result(res)
  }

  async getVisitTopdomain() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getVisitTopdomain(data)
    ctx.result(res)
  }

  async getVisitDistrict() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getVisitDistrict(data)
    ctx.result(res)
  }

  async getVisitWorld() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.baiduAnalytics.getVisitWorld(data)
    ctx.result(res)
  }
}

module.exports = BaiduAnalyticsController
