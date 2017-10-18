/*
*
* Music控制器
*
*/

const request = require("request")
const NeteseMusic = require("simple-netease-cloud-music")
const neteseMusic = new NeteseMusic()
const {
  handleError,
  handleSuccess
} = require("../utils/handle")

class MuscicController {

  // 获取列表
  static async getList (ctx) {
    const play_list_id = ctx.params.play_list_id
    if (!play_list_id || Object.is(Number(play_list_id), NaN)) {
      handleError({ ctx, message: '参数无效' })
      return false
    }
    const { playlist } =  await neteseMusic.playlist(play_list_id)
    handleSuccess({ ctx, result: playlist, message: '歌单列表获取成功' })
  }

  // 获取歌曲详情
  static async getSone (ctx) {
    const song_id = ctx.params.song_id
    if (!song_id || Object.is(Number(song_id), NaN)) {
      handleError({ ctx, message: '参数无效' })
      return false
    }
    const result = await neteseMusic.song(song_id, 128)
    handleSuccess({ ctx, result, message: '获取歌曲详情成功' })
  }

  // 歌曲地址
  static async getUrl (ctx) {
    const song_id = ctx.params.song_id
    if (!song_id || Object.is(Number(song_id), NaN)) {
      handleError({ ctx, message: '参数无效' })
      return false
    }
    const result = await neteseMusic.url(song_id, 700)
    handleSuccess({ ctx, result, message: '获取歌曲地址成功' })
  }

  // 歌词
  static async getLrc (ctx) {
    const song_id = ctx.params.song_id
    if (!song_id || Object.is(Number(song_id), NaN)) {
      handleError({ ctx, message: '参数无效' })
      return false
    }
    const result = await neteseMusic.lyric(song_id)
    handleSuccess({ ctx, result, message: '歌词获取成功' })
  }

  // 封面
  static async getPic (ctx) {
    const pic_id = ctx.params.pic_id
    if (!pic_id || Object.is(Number(pic_id), NaN)) {
      handleError({ ctx, message: '参数无效' })
      return false
    }
    const result = await neteseMusic.picture(pic_id, 700)
    handleSuccess({ ctx, result, message: '封面获取成功' })
  }
}

module.exports = MuscicController
