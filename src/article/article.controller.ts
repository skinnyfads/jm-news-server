import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service.js';
import { GenerateArticleDto } from './article.dto.js';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('generate')
  generate(@Body() dto: GenerateArticleDto) {
    return this.articleService.generate(dto.title, dto.text, dto.vocabIds);
  }

  @Get('feed')
  getFeed(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.articleService.getFeed(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  getFullArticle(@Param('id') id: string) {
    return this.articleService.getFullArticle(id);
  }
}
