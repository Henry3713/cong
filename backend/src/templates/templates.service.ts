// src/templates/templates.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async create(templateData: Partial<Template>): Promise<Template> {
    const template = this.templatesRepository.create({
      id: uuidv4(),
      ...templateData,
    });
    return this.templatesRepository.save(template);
  }

  async findAll(options: {
    page: number;
    limit: number;
    vendor?: string;
    name?: string;
    offiziell?: boolean;
    verifiziert?: boolean;
  }): Promise<{ templates: Template[]; totalPages: number }> {
    const { page, limit, vendor, name, offiziell, verifiziert } = options;

    const query = this.templatesRepository.createQueryBuilder('template');

    query.where('template.deleted = :deleted', { deleted: false });

    if (vendor) {
      query.andWhere('template.vendor = :vendor', { vendor });
    }

    if (name) {
      query.andWhere('template.name LIKE :name', { name: `%${name}%` });
    }

    if (offiziell || verifiziert) {
      const tagConditions = [];

      if (offiziell) {
        tagConditions.push("template.tags LIKE '%offiziell%'");
      }

      if (verifiziert) {
        tagConditions.push("template.tags LIKE '%verifiziert%'");
      }

      if (tagConditions.length > 0) {
        query.andWhere(`(${tagConditions.join(' OR ')})`);
      }
    }

    query.skip((page - 1) * limit).take(limit);

    const [templates, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return { templates, totalPages };
  }

  async assignTag(id: string, tag: string): Promise<void> {
    const template = await this.templatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template nicht gefunden.');
    }
    template.tags = template.tags || [];
    if (!template.tags.includes(tag)) {
      template.tags.push(tag);
    }
    await this.templatesRepository.save(template);
  }

  async removeTag(id: string, tag: string): Promise<void> {
    const template = await this.templatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template nicht gefunden.');
    }
    template.tags = template.tags || [];
    const tagIndex = template.tags.indexOf(tag);
    if (tagIndex > -1) {
      template.tags.splice(tagIndex, 1);
      await this.templatesRepository.save(template);
    } else {
      throw new BadRequestException('Tag ist nicht vorhanden.');
    }
  }

  async findOne(id: string): Promise<Template> {
    const template = await this.templatesRepository.findOne({ where: { id, deleted: false } });
    if (!template) {
      throw new NotFoundException('Template nicht gefunden.');
    }
    return template;
  }

  async update(id: string, updateData: Partial<Template>): Promise<Template> {
    const template = await this.templatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template nicht gefunden.');
    }
    Object.assign(template, updateData);
    return this.templatesRepository.save(template);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.templatesRepository.update(id, { deleted: true });
    if (result.affected === 0) {
      throw new NotFoundException('Template nicht gefunden.');
    }
  }

  async restore(id: string): Promise<void> {
    const result = await this.templatesRepository.update(id, { deleted: false });
    if (result.affected === 0) {
      throw new NotFoundException('Template nicht gefunden.');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.templatesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Template nicht gefunden.');
    }
  }

  findAllDeleted(): Promise<Template[]> {
    return this.templatesRepository.find({ where: { deleted: true } });
  }
}
