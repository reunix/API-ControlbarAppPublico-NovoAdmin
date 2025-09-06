import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ProdutosRepositorio } from '../interfaces/produtos-repositorio.interface';
import { BuscaProdutosAdminDto } from '../dtos/produtos-list-admin-request.dto';
import { ProdutoListAdminRespostaDto } from '../dtos/produtos-list-admin-resposta.dto';
import { ProdutosCrudRepositorio } from 'domain/produtos/interfaces/produtos-addupdate-repositorio.interface';
import { ProdutosCrudDto } from 'domain/produtos/dtos/atualiza-produtos.dto';
import { ProdutoModel } from 'domain/produtos/modelos/produtos-update.modelo';

@Controller('produtos')
export class ProdutosControlador {
  private readonly logger = new Logger(ProdutosControlador.name);

  constructor(
    @Inject('ProdutosRepositorio')
    private readonly repositorio: ProdutosRepositorio,
    @Inject('ProdutosCrudRepositorio')
    private readonly repositorioAddUPdateProdutos: ProdutosCrudRepositorio
  ) {}

  @Post('listadmin')
  @HttpCode(HttpStatus.OK) // Força o status 200 OK
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscarProdutosAdmin(
    @Body() buscaProdutosAdminDto: BuscaProdutosAdminDto
  ): Promise<ProdutoListAdminRespostaDto> {
    try {
      const produtosListAdmin: ProdutoListAdminRespostaDto =
        await this.repositorio.buscarProdutosListAdmin(
          buscaProdutosAdminDto.eventoId,
          buscaProdutosAdminDto.clienteId,
          buscaProdutosAdminDto.somenteComAlertas,
          buscaProdutosAdminDto.somenteComEntradas,
          buscaProdutosAdminDto.recuperarDadosAgregados
        );

      // console.log('produtosListAdmin', produtosListAdmin);

      return produtosListAdmin;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar produtos do evento: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar produtos do evento',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarConsignados(
    @Body() atualizaProdutoDto: ProdutosCrudDto
  ): Promise<ProdutoModel> {
    try {
      const { produto } = atualizaProdutoDto;

      // Validar se o array de consignados não está vazio
      if (!produto) {
        throw new HttpException(
          'Nenhum produto fornecido para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      console.log('produto', produto);

      // Chamar o método do repositório para atualizar os consignados
      const returnProdutoData =
        await this.repositorioAddUPdateProdutos.atualizarProdutos(produto);
      return returnProdutoData;

      // this.logger.log(`Consignados atualizados com sucesso.`);
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar produto: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar produto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
