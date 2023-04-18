import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import * as https from 'https';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ResultadosClient {
  private readonly logger = new Logger(ResultadosClient.name);

  constructor(private readonly httpService: HttpService) {}

  private agent = new https.Agent({
    rejectUnauthorized: false,
  });

  async ultimoResultadoLoteriaEscolhida(loteria: string) {
    this.logger.log(`Consultando o último sorteio...`);
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<object>(`${process.env.BASE_URL}/${loteria}`, {
            httpsAgent: this.agent,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('An error happened!');
              throw new Error("'An error happened!'");
            }),
          ),
      );
      this.logger.log(`Retornando o último sorteio cadastrado: ${loteria}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar último resultado!',
      );
    }
  }

  async ultimoResultadoLoteriaEConcursoEscolhido(
    loteria: string,
    concurso: string,
  ) {
    this.logger.log(`Consultando sorteio...`);
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<object>(`${process.env.BASE_URL}/${loteria}/${concurso}`, {
            httpsAgent: this.agent,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('An error happened!');
              throw new Error("'An error happened!'");
            }),
          ),
      );
      this.logger.log(`Retornando sorteio`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar resultado!');
    }
  }

  async ultimoResultadoTodosOsConcursos() {
    this.logger.log(`Consultando sorteios...`);
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<object>(`${process.env.BASE_URL}/home/ultimos-resultados`, {
            httpsAgent: this.agent,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('An error happened!');
              throw new Error("'An error happened!'");
            }),
          ),
      );
      this.logger.log(`Retornando ultimos sorteios`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar últimos resultados!',
      );
    }
  }
}
