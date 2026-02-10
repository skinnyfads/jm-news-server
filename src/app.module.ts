import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JMDictModule } from './jmdict/jmdict.module.js';
import { TokenizerModule } from './tokenizer/tokenizer.module.js';
import { VocabularyModule } from './vocabulary/vocabulary.module.js';
import { ArticleModule } from './article/article.module.js';
import { VocabularyReference } from './vocabulary/vocabulary.entity.js';
import { Article } from './article/article.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/jm-news.db',
      entities: [VocabularyReference, Article],
      synchronize: true,
    }),
    JMDictModule,
    TokenizerModule,
    VocabularyModule,
    ArticleModule,
  ],
})
export class AppModule {}
