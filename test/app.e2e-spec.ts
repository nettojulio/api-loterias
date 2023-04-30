import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResultadosClient } from '../src/resultados/resultados.client';
import { ResultadosController } from '../src/resultados/resultados.controller';
import { ResultadosModule } from '../src/resultados/resultados.module';
import { ResultadosService } from '../src/resultados/resultados.service';

describe('Loterias Resultados (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, AppModule],
      providers: [
        ResultadosModule,
        ResultadosController,
        ResultadosService,
        ResultadosClient,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/resultados/ (GET)', () => {
    it('Deve retornar status code 200', () => {
      return request(app.getHttpServer()).get('/api/resultados/').expect(200);
    });

    it('Deve retornar um objeto', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/')
        .expect(Object);
    });
  });

  describe('/api/resultados/{loteria} (GET)', () => {
    it('Deve retornar status code 200', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil?inicial=1&final=2')
        .expect(200);
    });

    it('Deve retornar um Array', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil?inicial=1&final=2')
        .expect(Array);
    });
  });

  describe('/api/resultados/{loteria}/ultimo (GET)', () => {
    it('Deve retornar status code 200', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil/ultimo')
        .expect(200);
    });

    it('Deve retornar um Objeto', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil/ultimo')
        .expect(Object);
    });
  });

  describe('/api/resultados/{loteria}/{concurso} (GET)', () => {
    it('Deve retornar status code 200', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil/1')
        .expect(200);
    });

    it('Deve retornar um Objeto', () => {
      return request(app.getHttpServer())
        .get('/api/resultados/lotofacil/1')
        .expect(Object);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
