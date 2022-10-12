import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TopLevelCategory } from "../top-page.model";

class Advantage {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

class HHData {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class TopPageUpdateDto {
  @IsOptional()
  @IsEnum(TopLevelCategory)
  firstCategory?: TopLevelCategory;

  @IsOptional()
  @IsString()
  secondCategory?: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Advantage)
  advantages?: Advantage[];

  @IsOptional()
  @IsString()
  seoText?: string;

  @IsOptional()
  @IsString()
  tagsTitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @ValidateNested()
  hh?: HHData;
}