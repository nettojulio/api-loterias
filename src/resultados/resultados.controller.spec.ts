import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultadosClient } from './resultados.client';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

describe('ResultadosController', () => {
  let controller: ResultadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ResultadosController],
      providers: [ResultadosService, ResultadosClient],
    }).compile();

    controller = module.get<ResultadosController>(ResultadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
