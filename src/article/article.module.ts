import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity.js';
import { ArticleService } from './article.service.js';
import { ArticleController } from './article.controller.js';
import { TokenizerModule } from '../tokenizer/tokenizer.module.js';
import { VocabularyModule } from '../vocabulary/vocabulary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    TokenizerModule,
    VocabularyModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
