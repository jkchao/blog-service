import { createParamDecorator } from '@nestjs/common';

export const Info = createParamDecorator((data, [root, args, ctx, info]) => {
  return args.linkInfo;
});
