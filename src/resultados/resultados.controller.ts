import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ListaDeLoterias } from './lista-de-loterias/lista-loterias.enum';
import { ResultadosService } from './resultados.service';

@ApiTags('Resultados')
@Controller('api/resultados')
export class ResultadosController {
  private readonly logger = new Logger(ResultadosController.name);
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get('/:loteria')
  @HttpCode(200)
  @ApiParam({
    name: `loteria`,
    enum: ListaDeLoterias,
    description: 'Loteria desejada',
    required: true,
  })
  @ApiOperation({ summary: `Último concurso da loteria escolhida.` })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async latestResult(@Param('loteria') loteria: string) {
    this.logger.log('Requisição recebida, validando parametros...');
    if (!ListaDeLoterias[loteria]) {
      this.logger.error(`Loteria ${loteria} não é válida`);
      throw new BadRequestException('Loteria não cadastrada');
    }
    return this.resultadosService.ultimoResultadoLoteriaEscolhida(loteria);
  }

  @Get('/:loteria/:concurso')
  @HttpCode(200)
  @ApiParam({
    name: `loteria`,
    enum: ListaDeLoterias,
    description: 'Loteria desejada',
    required: true,
  })
  @ApiParam({
    name: `concurso`,
    description: 'Concurso desejado',
    required: true,
  })
  @ApiOperation({ summary: `Resultado da loteria e concurso escolhidos.` })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async searchResult(
    @Param('loteria') loteria: string,
    @Param('concurso') concurso: string,
  ) {
    this.logger.log('Requisição recebida, validando parametros...');
    if (!ListaDeLoterias[loteria]) {
      this.logger.error(`Loteria ${loteria} não é válida`);
      throw new BadRequestException('Loteria não cadastrada');
    }

    if (!Number.parseInt(concurso) || Number.parseInt(concurso) < 1) {
      this.logger.error(`Concurso informado não é válido`);
      throw new BadRequestException('Concurso inválido');
    }

    return this.resultadosService.ultimoResultadoLoteriaEConcursoEscolhido(
      loteria,
      concurso,
    );
  }

  @Get('')
  @HttpCode(200)
  @ApiOperation({ summary: `Último resultado de TODAS as loterias` })
  @ApiOkResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async getAllResults() {
    this.logger.log('Requisição recebida...');
    return this.resultadosService.ultimoResultadoTodosOsConcursos();
  }
}
