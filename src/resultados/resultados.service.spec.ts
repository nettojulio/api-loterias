import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultadosClient } from './resultados.client';
import { ResultadosService } from './resultados.service';

describe('ResultadosService', () => {
  let service: ResultadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ResultadosService,
        ResultadosClient,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<ResultadosService>(ResultadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
