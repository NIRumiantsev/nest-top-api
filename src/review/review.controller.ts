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
import { TelegramService } from "../telegram/telegram.service";

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService
  ) {}

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `Имя: ${dto.name}\n` +
      `Заголовок: ${dto.title}\n` +
      `Описание: ${dto.description}\n` +
      `Рейтинг: ${dto.rating}\n`+
      `ID Продукта: ${dto.rating}`;
    return await this.telegramService.sendMessage(message);
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
