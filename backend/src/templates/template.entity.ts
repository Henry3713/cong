// src/templates/template.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  vendor: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('text')
  content: string;

  @Column({ default: false })
  deleted: boolean;

  constructor() {
    this.id = '';
    this.name = '';
    this.vendor = '';
    this.tags = [];
    this.content = '';
    this.deleted = false;
  }
}
