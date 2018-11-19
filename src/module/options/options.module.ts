import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsResolver } from './options.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionsSchema } from './schema/options.shema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Options', schema: OptionsSchema }])],
  providers: [OptionsService, OptionsResolver]
})
export class OptionsModule {}
