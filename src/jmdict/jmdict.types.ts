export interface JMDictRawWord {
  id: string;
  kanji: { common: boolean; text: string }[];
  kana: { common: boolean; text: string; appliesToKanji: string[] }[];
  sense: {
    partOfSpeech: string[];
    appliesToKanji: string[];
    appliesToKana: string[];
    gloss: { lang: string; text: string }[];
  }[];
}

export interface JMDictRawFile {
  version: string;
  languages: string[];
  dictDate: string;
  dictRevisions: string[];
  words: JMDictRawWord[];
}

export interface DictEntry {
  readings: string[];
  meanings: string[];
  pos: string[];
}
