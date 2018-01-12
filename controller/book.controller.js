/*
*
* 书本控制器
*
*/

const Book = require('../model/book.model')
const {
  handleSuccess,
	handleError
} = require("../utils/handle")

class BookController {
	
	// 获取书本列表
	static async getBooks (ctx) {
		const { current_page = 1, page_size = 18, keyword = '' } = ctx.query

		// 过滤条件
		const options = {
			sort: { id: 1 },
			page: Number(current_page),
			limit: Number(page_size)
		}

		// 参数
		const querys = {
			name: new RegExp(keyword)
		}

		const book = await Book
								.paginate(querys, options)
								.catch(err => ctx.throw(500, '服务器内部错误'))
		if (book) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: book.total,
            current_page: book.page,
            total_page: book.pages,
            page_size: book.limit
          },
          list: book.docs
        },
        message: '列表数据获取成功!'
      })
    } else handleError({ ctx, message: '获取书本列表失败' })
	}

	// 添加书本
	static async postBook (ctx) {
		const { name, descript, thumb } = ctx.request.body

		// 添加前，先验证是否有相同 name
		const res = await Book
								.find({ name })
								.catch(err => handleError({ ctx, message: '服务器内部错误' }))
		if (res && res.length !== 0) {
			handleError({ ctx, message: '已存在相同书本名' })
			return false
		}

		const book = await new Book({ name, descript })
											.save()
											.catch(err => handleError({ ctx, message: '服务器内部错误' }))
		if (book) handleSuccess({ ctx, message: '发布书本成功', result: book })
		else handleError({ ctx, message: '发布书本失败' })
	}

	// 修改书本状态
	static async patchBook (ctx) {
    const _id = ctx.params.id

    const { state } = ctx.request.body

    if (state) querys.state = state

    if (!_id) {
      handleError({ ctx, message: '无效参数'})
      return false
    }
  
    const res = await Book
                      .findByIdAndUpdate(_id, querys)
                      .catch(err => ctx.throw(500, '服务器内部错误'))
    if (res) handleSuccess({ ctx, message: '更新数据状态成功'})
    else handleError({ ctx, message: '更新数据状态失败' })
	}

	// 修改书本
	static async putBook (ctx) {
		const _id = ctx.params.id

		const { name, descript, thumb } = ctx.request.body

		if (!_id) {
			handleError({ ctx, message: '无效参数'})
			return false
		}

		const res = await Book
											.findByIdAndUpdate(_id, { name, descript, thumb }, { new: true })
											.catch(err => ctx.throw(500, '服务器内部错误'))
		if (res) handleSuccess({ ctx, message: '修改数据成功' })
		else handleError({ ctx, message: '修改数据失败' })
	}

	// 删除书本
	static async deleteBook (ctx) {
		const _id = ctx.params.id

		if (!_id) {
			handleError({ ctx, message: '无效参数'})
			return false
		}

		let res = await Book
										.findByIdAndRemove(_id)
										.catch(err => ctx.throw(500, '服务器内部错误'))
		if (res) handleSuccess({ ctx, message: '删除数据成功' })
		else handleError({ ctx, message: '删除数据失败'})
	}
}

module.exports = BookController
