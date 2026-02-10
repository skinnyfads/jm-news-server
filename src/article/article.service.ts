import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Article } from './article.entity.js';
import { TokenizerService } from '../tokenizer/tokenizer.service.js';
import { VocabularyService } from '../vocabulary/vocabulary.service.js';
import type { Token } from '../tokenizer/tokenizer.types.js';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
    private readonly tokenizer: TokenizerService,
    private readonly vocabularyService: VocabularyService,
  ) {}

  async generate(title: string, text: string, vocabIds?: string[]) {
    let targetDictKeys: Set<string> | undefined;

    if (vocabIds && vocabIds.length > 0) {
      const vocabs = await this.vocabularyService.findByIds(vocabIds);
      targetDictKeys = new Set(vocabs.map((v) => v.dictKey));
    }

    const tokens = this.tokenizer.tokenize(text, targetDictKeys);
    const previewText = text.slice(0, 200);

    const article = this.repo.create({
      id: uuid(),
      title,
      rawText: text,
      previewText,
      tokensJson: JSON.stringify(tokens),
      targetVocabIds: vocabIds ? JSON.stringify(vocabIds) : null,
    });

    return this.repo.save(article);
  }

  async getFeed(page = 1, limit = 20) {
    const [items, total] = await this.repo.findAndCount({
      select: ['id', 'title', 'previewText', 'createdAt'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFullArticle(id: string) {
    const article = await this.repo.findOneByOrFail({ id });
    const tokens: Token[] = JSON.parse(article.tokensJson);

    return {
      id: article.id,
      title: article.title,
      tokens,
    };
  }
}
