import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service.js';
import { CreateVocabularyDto } from './vocabulary.dto.js';

@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabularyService.create(dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.vocabularyService.softDelete(id);
    return { success: true };
  }

  @Get('random')
  getRandom(@Query('n') n?: string) {
    return this.vocabularyService.findRandom(n ? parseInt(n, 10) : 5);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.vocabularyService.findActive(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
