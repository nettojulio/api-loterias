import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
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

    let value = await this.cacheManager.get(cacheKey);
    if (!value) {
      this.logger.log('Obtendo dados via HTTPS');
      value = await this.resultadosClient.ultimoResultadoLoteriaEscolhida(
        loteria,
      );
      this.logger.log(`Resultado registrado em cache: ${cacheKey}`);
      await this.cacheManager.set(cacheKey, value);
    }
    return value;
  }

  async ultimoResultadoLoteriaEConcursoEscolhido(
    loteria: string,
    concurso: number,
  ) {
    const cacheKey = `resultado:${loteria}:${concurso}:latest`;

    let value = await this.cacheManager.get(cacheKey);
    if (!value) {
      this.logger.log('Obtendo dados via HTTPS');
      value =
        await this.resultadosClient.ultimoResultadoLoteriaEConcursoEscolhido(
          loteria,
          concurso,
        );
      this.logger.log(`Resultado registrado em cache: ${cacheKey}`);
      await this.cacheManager.set(cacheKey, value);
    }
    return value;
  }

  async ultimoResultadoTodosOsConcursos() {
    const cacheKey = 'resumo:latest';

    let values: any = await this.cacheManager.get(cacheKey);

    if (!values) {
      this.logger.log('Obtendo dados via HTTPS');
      values = await this.resultadosClient.ultimoResultadoTodosOsConcursos();
      this.logger.log(`Resultado registrado em cache: ${cacheKey}`);
      await this.cacheManager.set(cacheKey, values);

      for (const value in values) {
        const cacheKeyValue = `resumo:${value}:latest`;
        await this.cacheManager.set(cacheKeyValue, values[value]);
      }
    }

    return values;
  }
}
