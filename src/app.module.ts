import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JMDictModule } from './jmdict/jmdict.module.js';
import { TokenizerModule } from './tokenizer/tokenizer.module.js';
import { VocabularyModule } from './vocabulary/vocabulary.module.js';
import { ArticleModule } from './article/article.module.js';
import { VocabularyReference } from './vocabulary/vocabulary.entity.js';
import { Article } from './article/article.entity.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
      exclude: ['/api/(.*)'],
    }),
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
