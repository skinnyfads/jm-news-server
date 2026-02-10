export interface Token {
  surface: string;
  base: string;
  reading: string;
  pos: string;
  meanings: string[];
  vocabId?: string;
  isTarget: boolean;
  index: number;
}
