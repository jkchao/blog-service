import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkResolver } from './link.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkSchema } from './schema/link.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Links', schema: LinkSchema }])],
  providers: [LinkService, LinkResolver]
})
export class LinkModule {}
