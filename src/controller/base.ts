import { BaseContext } from 'koa'

export class Controller {
  public ctx: BaseContext

  constructor (ctx: BaseContext) {
    this.ctx = ctx
  }
}
