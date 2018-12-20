import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CommentInfo } from './interface/comments.interface';
import { CommentInfoDto, QueryCommentDto, UpdateCommentDto } from './dto/comments.dto';
import geoip from 'geoip-lite';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private readonly commentsModel: PaginateModel<CommentInfo>,
    // TODO: any
    @InjectModel('Articles') private readonly articlesModel: PaginateModel<any>,
    private readonly emailService: EmailService
  ) {}

  // 更新当前所受影响的文章的评论聚合数据
  public async updateArticleCommentCount(ids: number[] = []) {
    const postIds = [...new Set(ids)].filter(id => !!id);
    if (postIds.length) {
      const counts = await this.commentsModel.aggregate([
        { $match: { state: 1, post_id: { $in: postIds } } },
        { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } }
      ]);
      if (counts.length === 0) {
        this.articlesModel.update({ id: postIds[0] }, { $set: { 'meta.comments': 0 } });
      } else {
        counts.forEach(async count => {
          await this.articlesModel.update({ id: count._id }, { $set: { 'meta.comments': count.num_tutorial } });
        });
      }
    }
  }

  // 列表
  public searchComments({ offset = 0, limit = 10, keyword = '', state = 0, sort = -1, post_id }: QueryCommentDto) {
    const options: {
      sort: { _id?: number; likes?: number };
      offset: number;
      limit: number;
    } = {
      sort: { _id: sort },
      offset,
      limit
    };

    // 排序字段
    if ([1, -1].includes(sort)) {
      options.sort = { _id: sort };
    } else if (Object.is(sort, 2)) {
      options.sort = { likes: -1 };
    }

    const querys: {
      state?: number;
      $or?: any;
      post_id?: number;
    } = {};

    // 查询各种状态
    if ([0, 1, 2].includes(state)) {
      querys.state = state;
    }

    // 通过post-id过滤
    if (!Object.is(post_id, undefined)) {
      querys.post_id = post_id;
    }

    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys.$or = [{ content: keywordReg }, { 'author.name': keywordReg }, { 'author.email': keywordReg }];
    }
    return this.commentsModel.paginate(querys, options);
  }

  // 创建
  public async createComment(comment: CommentInfoDto & { ip: string }) {
    const ipLocation = geoip.lookup(comment.ip);
    if (ipLocation) {
      comment.city = ipLocation.city;
      comment.range = ipLocation.range;
      comment.country = ipLocation.country;
    }
    comment.likes = 0;

    return await new this.commentsModel({ ...comment, state: 0 }).save();
  }

  // 删除
  public deleteComment(_id: string) {
    return this.commentsModel.findByIdAndRemove(_id);
  }

  // 发邮件
  public async sendEmail(comment: CommentInfoDto, link: string) {
    this.emailService.sendEmail({
      to: 'jkchao@foxmail.com',
      subject: '博客有新的留言',
      text: `来自 ${comment.author.name} 的留言：${comment.content}`,
      html: `
            <p> 来自 ${comment.author.name} 的留言：${comment.content}</p>
            <br>
            <a href="${link}" target="_blank">[ 点击查看 ]</a>
        `
    });

    if (!!comment.pid) {
      const parentComment = await this.commentsModel.findOne({ id: comment.pid });
      if (parentComment) {
        this.emailService.sendEmail({
          to: parentComment.author.email,
          subject: '你在jkchao.cn有新的评论回复',
          text: `来自 ${comment.author.name} 的评论回复：${comment.content}`,
          // tslint:disable-next-line:max-line-length
          html: `
                <p> 来自${comment.author.name} 的评论回复：${comment.content}</p>
                <br>
                <a href="${link}" target="_blank">[ 点击查看 ]</a>
              `
        });
      }
    }
  }

  // 更新
  public async updateComment(comment: UpdateCommentDto) {
    return this.commentsModel.findByIdAndUpdate(comment._id, comment, { new: true });
  }
}
