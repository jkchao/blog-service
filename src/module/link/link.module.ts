import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkResolver } from './link.resolvers';

@Module({
  providers: [LinkService, LinkResolver]
})
export class LinkModule {}
