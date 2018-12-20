export class TagInfoDto {
  public _id: string;
  public name: string;
  public descript: string;
  public sort?: number;
}

export class CreateTagDto {
  public name: string;
  public descript: string;
}

export class QueryTagsDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
}
