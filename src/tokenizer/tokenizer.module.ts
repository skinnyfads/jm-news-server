import { Module } from '@nestjs/common';
import { TokenizerService } from './tokenizer.service.js';

@Module({
  providers: [TokenizerService],
  exports: [TokenizerService],
})
export class TokenizerModule {}
