import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsResolver } from './options.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionsShema } from './schema/options.shema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Options', schema: OptionsShema }])],
  providers: [OptionsService, OptionsResolver]
})
export class OptionsModule {}
