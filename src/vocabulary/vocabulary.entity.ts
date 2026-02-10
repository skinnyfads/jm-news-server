import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vocabulary_references')
export class VocabularyReference {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  dictKey!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  note!: string | null;

  @Column({ type: 'integer', nullable: true })
  level!: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags!: string | null;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
