import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyReference } from './vocabulary.entity.js';
import { VocabularyService } from './vocabulary.service.js';
import { VocabularyController } from './vocabulary.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([VocabularyReference])],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
