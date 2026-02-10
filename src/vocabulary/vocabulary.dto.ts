import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  dictKey!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

export class RandomQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  n?: number;
}
