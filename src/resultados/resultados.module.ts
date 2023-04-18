import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ResultadosClient } from './resultados.client';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

@Module({
  imports: [HttpModule],
  controllers: [ResultadosController],
  providers: [ResultadosService, ResultadosClient],
})
export class ResultadosModule {}
