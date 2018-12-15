import { Module } from '@nestjs/common';
import { HerosService } from './heros.service';
import { HerosResolver } from './heros.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { HerosSchema } from './schema/heros.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Heros', schema: HerosSchema }])],
  providers: [HerosService, HerosResolver]
})
export class HerosModule {}
