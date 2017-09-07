/* 公共解析器 */

exports.handleRequest = ({ ctx, controller }) => {
	const method = ctx.request.method;
	const support = !!controller[method];
	if (support) return controller[method](ctx);
	else return ctx.body = { code: 0, message: '不支持请求类型' }
};

exports.handleError = ({ ctx, message = '请求失败', err = null }) => {
	ctx.body = { code: 0, message, debug: err };
};

exports.handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
	ctx.response.body = { code: 1, message, result };
};

exports.handleThrottle = (method, delay) => {
	let canRun = true;
	return () => {
		if (canRun) {
			canRun = false;
			method();
			setTimeout(function() {
			 	canRun = true;
			}, delay);
		}
	}
}
