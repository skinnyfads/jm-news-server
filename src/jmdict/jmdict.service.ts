import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import type {
  DictEntry,
  JMDictRawFile,
  JMDictRawWord,
} from './jmdict.types.js';

@Injectable()
export class JMDictService implements OnModuleInit {
  private readonly logger = new Logger(JMDictService.name);
  private readonly index = new Map<string, DictEntry>();

  onModuleInit() {
    const filePath = join(process.cwd(), 'data', 'jmdict-eng.json');
    this.logger.log(`Loading JMDict from ${filePath}...`);

    let raw: JMDictRawFile;
    try {
      raw = JSON.parse(readFileSync(filePath, 'utf-8')) as JMDictRawFile;
    } catch {
      this.logger.warn(
        'JMDict file not found. Run "pnpm download:jmdict" to fetch it.',
      );
      return;
    }

    for (const word of raw.words) {
      const entry = this.wordToEntry(word);
      for (const k of word.kanji) {
        if (!this.index.has(k.text)) {
          this.index.set(k.text, entry);
        }
      }
      for (const k of word.kana) {
        if (!this.index.has(k.text)) {
          this.index.set(k.text, entry);
        }
      }
    }

    this.logger.log(`JMDict loaded: ${this.index.size} entries indexed.`);
  }

  lookup(baseForm: string): DictEntry | null {
    return this.index.get(baseForm) ?? null;
  }

  private wordToEntry(word: JMDictRawWord): DictEntry {
    const readings = word.kana.map((k) => k.text);
    const meanings = word.sense.flatMap((s) =>
      s.gloss.filter((g) => g.lang === 'eng').map((g) => g.text),
    );
    const pos = word.sense.flatMap((s) => s.partOfSpeech);
    return { readings, meanings, pos: [...new Set(pos)] };
  }
}
