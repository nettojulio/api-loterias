import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultadosClient } from './resultados.client';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

describe('ResultadosClient', () => {
  let client: ResultadosClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ResultadosController],
      providers: [
        ResultadosService,
        ResultadosClient,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    client = module.get<ResultadosClient>(ResultadosClient);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });
});
