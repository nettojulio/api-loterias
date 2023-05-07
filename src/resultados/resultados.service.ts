import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Resultados } from './lista-de-loterias/resultados.dto';
import { ResultadosClient } from './resultados.client';

@Injectable()
export class ResultadosService {
  private readonly logger = new Logger(ResultadosService.name);

  constructor(
    private readonly resultadosClient: ResultadosClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async ultimoResultadoLoteriaEscolhida(loteria: string) {
    const cacheKey = `resultado:${loteria}:latest`;
    const cache = await this.getCache(cacheKey);

    if (cache) {
      const cacheObj: object = Object(cache);
      return cacheObj;
    }

    this.logger.log('Obtendo dados via HTTPS');

    const resultado =
      await this.resultadosClient.ultimoResultadoLoteriaEscolhida(loteria);

    await this.setCache(cacheKey, resultado);

    return resultado;
  }

  async ultimoResultadoLoteriaEConcursoEscolhido(
    loteria: string,
    concurso: number,
  ) {
    const cacheKey = `resultado:${loteria}:${concurso}`;
    const cache = await this.getCache(cacheKey);

    if (cache) {
      const cacheObj: object = Object(cache);
      return cacheObj;
    }

    this.logger.log('Obtendo dados via HTTPS');
    const resultado =
      await this.resultadosClient.ultimoResultadoLoteriaEConcursoEscolhido(
        loteria,
        concurso,
      );

    await this.setCache(cacheKey, resultado);

    return resultado;
  }

  async ultimoResultadoTodosOsConcursos() {
    const cacheKey = 'resumo:latest';

    const cache = await this.getCache(cacheKey);

    if (cache) {
      const cacheObj: Resultados = Object(cache);
      return cacheObj;
    }

    this.logger.log('Obtendo dados via HTTPS');
    const resultado =
      await this.resultadosClient.ultimoResultadoTodosOsConcursos();

    await this.setCache(cacheKey, resultado);

    for (const value in resultado) {
      const cacheKeyValue = `resumo:${value}:latest`;
      await this.setCache(cacheKeyValue, resultado[value]);
    }

    return resultado;
  }

  async multiplosResultados(loteria: string, inicial: number, final: number) {
    const concursosList: Array<number> = [];

    if (final - inicial > 100) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded.',
        },
        429,
      );
    }

    for (let i = inicial; i <= final; i++) {
      concursosList.push(i);
    }

    return await Promise.all(
      concursosList.map(async item => {
        const cacheKey = `resultado:${loteria}:${item}`;
        const cache = await this.getCache(cacheKey);

        if (cache) {
          const cacheObj: object = Object(cache);
          return cacheObj;
        }

        const resultado =
          await this.resultadosClient.ultimoResultadoLoteriaEConcursoEscolhido(
            loteria,
            item,
          );

        await this.setCache(cacheKey, resultado);

        return resultado;
      }),
    );
  }

  private async getCache(key: string) {
    const data = await this.cacheManager.get(key);
    this.logger.log('Verificando cache: ' + (data ? 'HIT' : 'MISS'));
    return data;
  }

  private async setCache(key: string, value: any) {
    this.logger.log(`Resultado registrado em cache: ${key}`);
    await this.cacheManager.set(key, value);
  }
}
