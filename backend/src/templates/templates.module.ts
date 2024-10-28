// src/templates/templates.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Template } from './template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
