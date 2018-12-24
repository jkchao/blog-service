import { Test } from '@nestjs/testing';

import { CommentsModule } from '../comments.module';
import { CommentsService } from '../comments.service';
import { getModelToken } from '@nestjs/mongoose';

import mongoose from 'mongoose';
import { ArticlesSercice } from '../../articles/articles.service';
import { EmailService } from '../../common/email/email.service';
import { CommentInfoDto, QueryCommentDto, UpdateCommentDto } from '../dto/comments.dto';

describe('comments', () => {
  let commentsService: CommentsService;
  const mock = jest.fn();
  mock.mockReturnValueOnce([]).mockReturnValueOnce([1, 2]);
  // tslint:disable-next-line:class-name
  class mockRepository {
    public static paginate() {
      return { docs: [] };
    }
    public static findOneAndRemove() {
      return {};
    }
    public static findOneAndUpdate() {
      return {};
    }
    public static findOne() {
      return { author: { name: '' } };
    }
    public static aggregate() {
      return [];
    }

    public save() {
      return {};
    }
  }

  const articlesService = {
    updateArticle() {
      return {};
    }
  };

  const emailService = {
    sendEmail() {
      return {};
    }
  };

  mockRepository.prototype.save = () => ({});

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CommentsModule]
    })
      .overrideProvider(getModelToken('Comments'))
      .useValue(mockRepository)
      .overrideProvider(getModelToken('Articles'))
      .useValue({})
      .overrideProvider(ArticlesSercice)
      .useValue(articlesService)
      .overrideProvider(EmailService)
      .useValue(emailService)
      .compile();

    commentsService = module.get<CommentsService>(CommentsService);
  });

  it('createComments', async () => {
    const obj = {
      ip: '95.179.198.236'
    } as CommentInfoDto & { ip: string };
    const res = await commentsService.createComment(obj);
    expect(res).toMatchObject(new mockRepository().save());
  });

  it('updateArticleCommentCount', async () => {
    const res = await commentsService.updateArticleCommentCount([1, 2, 3]);
    expect(res);
  });

  it('sendEmail', async () => {
    const obj = {
      pid: 1,
      author: {
        name: ''
      }
    } as CommentInfoDto;
    const res = await commentsService.sendEmail(obj, '');
    expect(res);
  });

  it('updateArticleCommentCount return counts', async () => {
    const res = await commentsService.updateArticleCommentCount([1, 2, 3]);
    expect(res);
  });

  it('searchComments sort 2', async () => {
    const obj = {
      sort: 2,
      post_id: 1,
      keyword: 'hh'
    } as QueryCommentDto;
    const res = await commentsService.searchComments(obj);
    expect(res).toMatchObject(mockRepository.paginate());
  });

  it('searchComments sort 1', async () => {
    const obj = {} as QueryCommentDto;
    const res = await commentsService.searchComments(obj);
    expect(res).toMatchObject(mockRepository.paginate());
  });

  it('updateComments', async () => {
    const obj = {} as UpdateCommentDto;
    const res = await commentsService.updateComment(obj);
    expect(res).toMatchObject(mockRepository.findOneAndUpdate());
  });

  it('deleteComments', async () => {
    const res = await commentsService.deleteComment('12345');
    expect(res).toMatchObject(mockRepository.findOneAndRemove());
  });

  it('findComment', async () => {
    const res = await commentsService.findComment('12345');
    expect(res).toMatchObject({ state: undefined });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
