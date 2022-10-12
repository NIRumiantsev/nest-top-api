import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  UsePipes,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { CreateReviewDto } from "./dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { IdValidationPipe } from "../pipes/id-validation.pipe";

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtGuard)
  @Get('product/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return await this.reviewService.findByProductId(productId);
  }

  @UseGuards(JwtGuard)
  @Delete('product/:productId')
  async deleteByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return await this.reviewService.deleteByProductId(productId);
  }
}
