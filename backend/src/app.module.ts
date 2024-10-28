// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesModule } from './templates/templates.module';
import { Template } from './templates/template.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Mache das ConfigModule global
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/cong.db',
      entities: [Template],
      synchronize: true,
      autoLoadEntities: true, // Optional, um alle Entitäten automatisch zu laden
    }),
    TemplatesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
