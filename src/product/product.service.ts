import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateProductDto, FindProductDto, UpdateProductDto } from "./dto";
import { ProductModel } from "./product.model";
import { ReviewModel } from "../review/review.model";

type ReviewInfo = { review: ReviewModel[], reviewCount: number, reviewAvg: number };
type ProductWithReviewInfo = ProductModel & ReviewInfo;

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {}

  async create(dto: CreateProductDto) {
    // @ts-ignore
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel.aggregate([
      {
        $match: {
          categories: dto.category
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $limit: dto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: '_id',
          foreignField: 'productId',
          as: 'review',
        }
      },
      {
        $addFields: {
          reviewCount: { $size: '$review' },
          reviewAvg: { $avg: '$review.rating' },
        }
      }
    ]).exec() as ProductWithReviewInfo[];
  }
}
