// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToClass } from 'class-transformer';

// type consturctor = new (...args: any[]) => any;

// /**
//  *  传入数据验证
//  *
//  * @export
//  * @class ValidationPipe
//  * @implements {PipeTransform<any>}
//  */

// @Injectable()
// export class ValidationPipe implements PipeTransform<any> {
//   private toValidate(metatype: consturctor): boolean {
//     const types = [String, Boolean, Number, Array, Object];
//     return !types.find(type => metatype === type);
//   }

//   public async transform(value: any, { metatype }: ArgumentMetadata) {
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//     const object = plainToClass(metatype, value);
//     const errors = await validate(object);
//     if (errors.length > 0) {
//       throw new BadRequestException('参数错误');
//     }
//     return value;
//   }
// }
