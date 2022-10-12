import { IsEnum } from "class-validator";
import { TopLevelCategory } from "../top-page.model";

export class TopPageFindDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
}