import {
  Controller,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FornecedorListAdminRepositorio } from '../interfaces/fornecedores-list-repositorio.interface';
import { FornecedorCrudRepositorio } from '../interfaces/fornecedores-addupdate-repositorio.interface';
import { ProdutosSubGruposListRespostaDto } from '../dtos/produtosSubgruposList-resposta.dto';
import { AtualizaFornecedoresDto } from '../dtos/atualiza-fornecedores.dto';
import { FornecedorModel } from '../modelos/fornecedores.modelo';

@Controller('fornecedores')
export class FornecedorControlador {
  private readonly logger = new Logger(FornecedorControlador.name);

  constructor(
    @Inject('FornecedorListRepositorio')
    private readonly repositorioFornecedoresList: FornecedorListAdminRepositorio,
    @Inject('FornecedorCrudRepositorio')
    private readonly repositorioFornecedoresCrud: FornecedorCrudRepositorio
  ) {}

  @Get(':clienteId/listafornecedoresadmin')
  @HttpCode(HttpStatus.OK)
  async buscarDespesasPorEvento(
    @Param('clienteId') clienteId: string
  ): Promise<ProdutosSubGruposListRespostaDto> {
    try {
      const clienteIdNumber = parseInt(clienteId, 10);
      if (isNaN(clienteIdNumber)) {
        throw new HttpException(
          'ID do produto inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const fornecedores: ProdutosSubGruposListRespostaDto =
        await this.repositorioFornecedoresList.buscarFornecedoresAdmin(
          clienteIdNumber
        );

      return fornecedores;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar fornecedores do cliente ${clienteId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar fornecedores',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarEventoDespesas(
    @Body() atualizaFrornecedorDto: AtualizaFornecedoresDto
  ): Promise<FornecedorModel> {
    try {
      const { fornecedor } = atualizaFrornecedorDto;

      // Validar se o array de despesas não está vazio
      if (!fornecedor) {
        throw new HttpException(
          'Nenhum fornecedor fornecido para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar as despesas
      return await this.repositorioFornecedoresCrud.atualizarFornecedor(
        fornecedor
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar fonecedor: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar fornecedor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':fonecedorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarEventoDespesa(
    @Param('fonecedorId') fonecedorId: string
  ): Promise<void> {
    try {
      const fonecedorIdNumber = parseInt(fonecedorId, 10);
      if (isNaN(fonecedorIdNumber)) {
        throw new HttpException(
          'ID da despesa inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioFornecedoresCrud.deletarFornecedor(
        fonecedorIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir fornecedor ${fonecedorId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir fornecedor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
