import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text' })
  rawText!: string;

  @Column({ type: 'text' })
  previewText!: string;

  @Column({ type: 'text' })
  tokensJson!: string;

  @Column({ type: 'text', nullable: true })
  targetVocabIds!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
