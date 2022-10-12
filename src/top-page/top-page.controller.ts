import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { TopPageCreateDto, TopPageUpdateDto, TopPageFindDto } from "./dto";
import { TopPageService } from "./top-page.service";
import { TOP_PAGE_NOT_FOUND_ERROR } from "./top-page.constants";

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(@Body() dto: TopPageCreateDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const topPage = this.topPageService.findById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedTopPage = this.topPageService.deleteById(id);
    if (!deletedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPageUpdateDto) {
    const updatedTopPage = this.topPageService.update(id, dto);
    if (!updatedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return updatedTopPage;
  }

  @HttpCode(200)
  @Post('category')
  async findByCategory(@Body() dto: TopPageFindDto) {
    const topPage = this.topPageService.findByCategory(dto);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @HttpCode(200)
  @Get('alias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    const topPage = this.topPageService.findByAlias(alias);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @Get('/search/:text')
  async search(@Param('text') text: string) {
    return this.topPageService.searchByText(text);
  }

}
