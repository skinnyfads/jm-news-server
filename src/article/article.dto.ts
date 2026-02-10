import { IsString, IsOptional, IsArray } from 'class-validator';

export class GenerateArticleDto {
  @IsString()
  title!: string;

  @IsString()
  text!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vocabIds?: string[];
}

export class FeedQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
