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
import { ProdutosentradasListRepositorio } from '../interfaces/produtosentradas-list-repositorio.interface';
import { ProdutoEntradasCrudRepositorio } from '../interfaces/produtosentradas-addupdate-repositorio.interface';
import { ProdutoEntradasListAdminRespostaDto } from '../dtos/produtosEntradas-list-admin-resposta.dto';
import { AtualizaProdutosEntradasDto } from '../dtos/atualiza-produtosentradas.dto';

@Controller('produtosentradas')
export class ProdutoEntradasControlador {
  private readonly logger = new Logger(ProdutoEntradasControlador.name);

  constructor(
    @Inject('ProdutoEntradasListRepositorio')
    private readonly repositorioProdutosEntradas: ProdutosentradasListRepositorio,
    @Inject('ProdutoEntradasCrudRepositorio')
    private readonly repositorioCrudProdutoentradas: ProdutoEntradasCrudRepositorio
  ) {}

  @Get(':produtoId/:clienteId/produtosentradas')
  @HttpCode(HttpStatus.OK)
  async buscarProdutosEntradasPorProduto(
    @Param('produtoId') produtoId: string,
    @Param('clienteId') clienteId: string
  ): Promise<ProdutoEntradasListAdminRespostaDto> {
    try {
      const produtoIdNumber = parseInt(produtoId, 10);
      if (isNaN(produtoIdNumber)) {
        throw new HttpException(
          'ID do produto inválido',
          HttpStatus.BAD_REQUEST
        );
      }
      const clienteIdNumber = parseInt(clienteId, 10);
      if (isNaN(clienteIdNumber)) {
        throw new HttpException(
          'ID do cliente inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const produtos: ProdutoEntradasListAdminRespostaDto =
        await this.repositorioProdutosEntradas.buscarProdutosEntradas(
          produtoIdNumber,
          clienteIdNumber
        );

      // console.log('produtos ', produtos);

      return produtos;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar entradas do produto ${produtoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar entradas de estoque',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarProdutoEntrada(
    @Body() atualizaProdutoEntradaDto: AtualizaProdutosEntradasDto
  ): Promise<void> {
    try {
      const { entradas: entradasProdutos } = atualizaProdutoEntradaDto;

      // console.log('entradasProdutos', entradasProdutos);

      // Validar se o array de despesas não está vazio
      if (!entradasProdutos || entradasProdutos.length === 0) {
        throw new HttpException(
          'Nenhuma entrada fornecida para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar as despesas
      await this.repositorioCrudProdutoentradas.atualizarProdutoEntradaS(
        entradasProdutos
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar entrada de estoque: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar entradas de estoque',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':entradaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarEntradaEstoque(
    @Param('entradaId') entradaId: string
  ): Promise<void> {
    try {
      const entradaIdNumber = parseInt(entradaId, 10);
      console.log('entradaIdNumber', entradaIdNumber);
      if (isNaN(entradaIdNumber)) {
        throw new HttpException(
          'ID da despesa inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioCrudProdutoentradas.deletarProdutoEntrada(
        entradaIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir entrada ${entradaId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir entrada',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
