/* 公共解析器 */

import * as Koa from 'koa'

export interface IParams {
  ctx: Koa.Context
  message: string
  err?: any
  result?: any
}

export const handleError = (
  { ctx, message = '请求失败', err = '' }: IParams
) => {
  ctx.body = { code: 0, message, debug: err }
}

export const handleSuccess = (
  { ctx, message = '请求成功', result = '' }: IParams
) => {
  ctx.response.body = { code: 1, message, result }
}
