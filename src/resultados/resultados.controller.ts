import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
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
import { EnumValidationPipe } from './validacaoes/validacoes';

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
  @ApiOperation({ summary: `Resultado da loteria e concurso escolhidos.` })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async searchResult(
    @Param('loteria', new EnumValidationPipe(ListaDeLoterias)) loteria: string,
    @Param('concurso', ParseIntPipe) concurso: number,
  ) {
    this.logger.log('Requisição recebida, validando parametros...');
    return this.resultadosService.ultimoResultadoLoteriaEConcursoEscolhido(
      loteria,
      concurso,
    );
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: `Último resultado de TODAS as loterias` })
  @ApiOkResponse({ type: Object })
  @ApiInternalServerErrorResponse({ type: Object })
  async getAllResults() {
    this.logger.log('Requisição recebida...');
    return this.resultadosService.ultimoResultadoTodosOsConcursos();
  }
}
