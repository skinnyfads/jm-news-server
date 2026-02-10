import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as kuromoji from 'kuromoji';
import { JMDictService } from '../jmdict/jmdict.service.js';
import type { Token } from './tokenizer.types.js';

type KuromojiTokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

@Injectable()
export class TokenizerService implements OnModuleInit {
  private readonly logger = new Logger(TokenizerService.name);
  private tokenizer!: KuromojiTokenizer;
  private ready = false;

  constructor(private readonly jmdict: JMDictService) {}

  async onModuleInit() {
    this.tokenizer = await new Promise<KuromojiTokenizer>((resolve, reject) => {
      kuromoji
        .builder({ dicPath: 'node_modules/kuromoji/dict/' })
        .build((err, tokenizer) => {
          if (err) return reject(err);
          resolve(tokenizer);
        });
    });
    this.ready = true;
    this.logger.log('Kuromoji tokenizer ready.');
  }

  tokenize(text: string, targetDictKeys?: Set<string>): Token[] {
    if (!this.ready) {
      throw new Error('Tokenizer not initialized yet.');
    }

    const kuroTokens = this.tokenizer.tokenize(text);
    return kuroTokens.map((kt, index) => {
      const base = kt.basic_form !== '*' ? kt.basic_form : kt.surface_form;
      const reading = kt.reading ?? '';
      const pos = kt.pos ?? '';

      const dict =
        this.jmdict.lookup(base) ?? this.jmdict.lookup(kt.surface_form);
      const meanings = dict?.meanings ?? [];
      const fullPos = dict?.pos?.join(', ') ?? pos;

      const isTarget = targetDictKeys ? targetDictKeys.has(base) : false;

      return {
        surface: kt.surface_form,
        base,
        reading: dict?.readings?.[0] ?? reading,
        pos: fullPos,
        meanings,
        isTarget,
        index,
      };
    });
  }
}
