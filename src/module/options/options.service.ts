import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OptionsModel, OptionsInfo } from './interface/options.interface';

@Injectable()
export class OptionsService {
  constructor(@InjectModel('Options') private readonly optionsModel: Model<OptionsModel>) {}

  public getOptions() {
    return this.optionsModel.findOne();
  }

  public updateOptions(options: OptionsInfo) {
    if (options._id) {
      return this.optionsModel.findByIdAndUpdate(options._id, options, { new: true });
    }
    return new this.optionsModel(options).save();
  }
}
