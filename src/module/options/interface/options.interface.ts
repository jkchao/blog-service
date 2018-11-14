import { Document } from 'mongoose';

export interface OptionsBase {
  title?: string;

  // 网站副标题
  sub_title?: string;

  // 关键字
  keyword?: string;

  // 网站描述
  descript?: string;

  // 站点地址
  url?: string;

  // 网站官邮
  email?: string;

  // 备案号
  icp?: string;

  // 其他元信息
  meta?: {
    // 被喜欢次数
    likes: number;
  };
}

export interface OptionsModel extends Document, OptionsBase {}

export interface OptionsInfo extends OptionsBase {
  id?: string;
}
