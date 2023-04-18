import { Injectable, Logger } from '@nestjs/common';
import { ResultadosClient } from './resultados.client';

@Injectable()
export class ResultadosService {
  private readonly logger = new Logger(ResultadosService.name);

  constructor(private readonly resultadosClient: ResultadosClient) {}

  async ultimoResultadoLoteriaEscolhida(loteria: string) {
    return this.resultadosClient.ultimoResultadoLoteriaEscolhida(loteria);
  }

  async ultimoResultadoLoteriaEConcursoEscolhido(
    loteria: string,
    concurso: string,
  ) {
    return this.resultadosClient.ultimoResultadoLoteriaEConcursoEscolhido(
      loteria,
      concurso,
    );
  }

  async ultimoResultadoTodosOsConcursos() {
    return this.resultadosClient.ultimoResultadoTodosOsConcursos();
  }
}
