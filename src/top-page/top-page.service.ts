import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { TopLevelCategory, TopPageModel } from "./top-page.model";
import { TopPageCreateDto, TopPageFindDto, TopPageUpdateDto } from "./dto";

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {}

  async create(dto: TopPageCreateDto) {
    // @ts-ignore
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, dto: TopPageUpdateDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findByCategory({ firstCategory }: TopPageFindDto) {
    return this.topPageModel.aggregate([
      {
        $match: {
          firstCategory
        }
      },
      {
        $group: {
          _id: { secondCategory: '$secondCategory' },
          pages: { $push: { alias: '$alias', title: '$title' } },
        }
      }
    ]);
  }

  async searchByText(text: string) {
    return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
  }
}
