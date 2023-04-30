import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EnumValidationPipe } from '../utils/validacoes/validacoes-lista-loterias-enum';
import { ListaDeLoterias } from './lista-de-loterias/lista-loterias.enum';
import { ResultadosService } from './resultados.service';

@ApiTags('Resultados')
@Controller('api/resultados')
export class ResultadosController {
  private readonly logger = new Logger(ResultadosController.name);
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: `Resumo com o último resultado de todas as loterias`,
  })
  @ApiOkResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async getAllResults() {
    this.logger.log('Requisição recebida...');
    return this.resultadosService.ultimoResultadoTodosOsConcursos();
  }

  /**/
  @Get('/:loteria')
  @HttpCode(200)
  @ApiParam({
    name: `loteria`,
    enum: ListaDeLoterias,
    description: 'Loteria desejada',
    required: true,
  })
  @ApiQuery({
    name: `inicial`,
    description: 'Concurso desejado inicial',
    required: true,
  })
  @ApiQuery({
    name: `final`,
    description: 'Concurso desejado final',
    required: true,
  })
  @ApiOperation({
    summary: `Resultado da loteria específica e o intervalo de concursos escolhido.`,
  })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async fullSearchResult(
    @Param('loteria', new EnumValidationPipe(ListaDeLoterias))
    loteria: ListaDeLoterias,
    @Query('inicial', ParseIntPipe) inicial: number,
    @Query('final', ParseIntPipe) final: number,
  ) {
    //TODO Redefinir validacao
    if (inicial < 1 || final - inicial < 1) {
      throw new BadRequestException('Concursos inválidos');
    }
    this.logger.log('Requisição recebida, validando parametros...');
    return this.resultadosService.multiplosResultados(loteria, inicial, final);
  }
  /**/

  @Get('/:loteria/ultimo')
  @HttpCode(200)
  @ApiParam({
    name: `loteria`,
    enum: ListaDeLoterias,
    description: 'Loteria desejada',
    required: true,
  })
  @ApiOperation({
    summary: `Resultado do último concurso da loteria escolhida.`,
  })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async latestResult(
    @Param('loteria', new EnumValidationPipe(ListaDeLoterias))
    loteria: ListaDeLoterias,
  ) {
    this.logger.log('Requisição recebida, validando parametros...');
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
  @ApiOperation({ summary: `Resultado da loteria e concurso escolhido.` })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async searchResult(
    @Param('loteria', new EnumValidationPipe(ListaDeLoterias))
    loteria: ListaDeLoterias,
    @Param('concurso', ParseIntPipe) concurso: number,
  ) {
    //TODO Redefinir validacao
    if (concurso < 1) {
      throw new BadRequestException('Concurso inválido');
    }
    this.logger.log('Requisição recebida, validando parametros...');
    return this.resultadosService.ultimoResultadoLoteriaEConcursoEscolhido(
      loteria,
      concurso,
    );
  }
}
