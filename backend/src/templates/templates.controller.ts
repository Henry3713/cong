// src/templates/templates.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Template } from './template.entity';
import { ConfigService } from '@nestjs/config';

@Controller('api/templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly configService: ConfigService,
  ) {}

  // Erstellen eines neuen Templates
  @Post()
  async create(@Body() templateData: Partial<Template>): Promise<Template> {
    if (!templateData.name || !templateData.vendor || !templateData.content) {
      throw new BadRequestException('Fehlende erforderliche Felder.');
    }
    return this.templatesService.create(templateData);
  }

  // Abrufen aller Templates (ohne gelöschte)
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10,
    @Query('vendor') vendor?: string,
    @Query('name') name?: string,
    @Query('offiziell', new ParseBoolPipe()) offiziell?: boolean,
    @Query('verifiziert', new ParseBoolPipe()) verifiziert?: boolean,
  ): Promise<{ templates: Template[]; totalPages: number }> {
    const result = await this.templatesService.findAll({
      page,
      limit,
      vendor,
      name,
      offiziell,
      verifiziert,
    });
    return result;
  }

  // Abrufen eines einzelnen Templates
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Template> {
    const template = await this.templatesService.findOne(id);
    if (!template) {
      throw new NotFoundException('Template nicht gefunden.');
    }
    return template;
  }

  // Aktualisieren eines Templates
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Template>,
  ): Promise<Template> {
    return this.templatesService.update(id, updateData);
  }

  // In den Papierkorb verschieben (Soft-Delete)
  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.templatesService.softDelete(id);
  }

  // Alle gelöschten Templates abrufen
  @Get('trash/all')
  findAllDeleted(): Promise<Template[]> {
    return this.templatesService.findAllDeleted();
  }

  // Template aus dem Papierkorb wiederherstellen
  @Post('trash/restore/:id')
  async restore(@Param('id') id: string): Promise<void> {
    await this.templatesService.restore(id);
  }

  // Template dauerhaft löschen
  @Delete('trash/:id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.templatesService.remove(id);
  }

  // Endpunkt zum Zuweisen von Tags mit Passwortschutz
  @Post(':id/assign-tag')
  async assignTag(
    @Param('id') id: string,
    @Body() data: { tag: string; password: string },
  ): Promise<void> {
    const { tag, password } = data;
    if (!['offiziell', 'verifiziert'].includes(tag.toLowerCase())) {
      throw new BadRequestException('Ungültiger Tag.');
    }
    const correctPassword = this.configService.get<string>('VALIDATOR_PASSWORD');
    if (password !== correctPassword) {
      throw new BadRequestException('Falsches Passwort.');
    }
    await this.templatesService.assignTag(id, tag.toLowerCase());
  }

  // Endpunkt zum Entfernen von Tags
  @Post(':id/remove-tag')
  async removeTag(
    @Param('id') id: string,
    @Body() data: { tag: string; password: string },
  ): Promise<void> {
    const { tag, password } = data;
    if (!['offiziell', 'verifiziert'].includes(tag.toLowerCase())) {
      throw new BadRequestException('Ungültiger Tag.');
    }
    const correctPassword = this.configService.get<string>('VALIDATOR_PASSWORD');
    if (password !== correctPassword) {
      throw new BadRequestException('Falsches Passwort.');
    }
    await this.templatesService.removeTag(id, tag.toLowerCase());
  }
}
