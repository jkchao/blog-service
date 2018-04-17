/* 公共解析器 */

export const handleError = ({ ctx, message = '请求失败', err = null }) => {
  ctx.body = { code: 0, message, debug: err }
}

export const handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
  ctx.response.body = { code: 1, message, result }
}
