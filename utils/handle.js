/* 公共解析器 */

exports.handleRequest = ({ ctx, controller }) => {
	const method = ctx.request.method
	const support = !!controller[method]
	if (support) return controller[method](ctx)
	else return ctx.throw(404, '不支持请求类型')
}

exports.handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
	ctx.response.body = { code: 1, message, result }
}

exports.handleThrottle = (method, delay) => {
	let canRun = true
	return () => {
		if (canRun) {
			canRun = false
			method()
			setTimeout(function() {
			 	canRun = true
			}, delay)
		}
	}
}
