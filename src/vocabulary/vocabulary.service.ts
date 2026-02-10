import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { VocabularyReference } from './vocabulary.entity.js';
import { CreateVocabularyDto } from './vocabulary.dto.js';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(VocabularyReference)
    private readonly repo: Repository<VocabularyReference>,
  ) {}

  async create(dto: CreateVocabularyDto): Promise<VocabularyReference> {
    const vocab = this.repo.create({
      id: uuid(),
      dictKey: dto.dictKey,
      note: dto.note ?? null,
      level: dto.level ?? null,
      tags: dto.tags ?? null,
    });
    return this.repo.save(vocab);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { deletedAt: new Date() });
  }

  async findActive(page = 1, limit = 20) {
    const [items, total] = await this.repo.findAndCount({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findRandom(n = 5): Promise<VocabularyReference[]> {
    const all = await this.repo.find({
      where: { deletedAt: IsNull() },
    });
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  async findByIds(ids: string[]): Promise<VocabularyReference[]> {
    if (ids.length === 0) return [];
    return this.repo.findByIds(ids);
  }
}
