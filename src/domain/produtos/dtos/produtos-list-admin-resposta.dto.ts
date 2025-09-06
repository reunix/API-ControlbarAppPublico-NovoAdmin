import { PontosEntregasListRespostaDto } from 'domain/pontosentregas/dtos/pontosEntregasList-resposta.dto';
import { ProdutosGruposListRespostaDto } from 'domain/produtosgrupos/dtos/produtosGruposList-resposta.dto';
import { ProdutosSubGruposListRespostaDto } from 'domain/produtossubgrupos/dtos/produtosSubgruposList-resposta.dto';
import { ProdutoListAdminDto } from './produtoListAdmin.dto';

export interface ProdutosAgregados {
  grupos: ProdutosGruposListRespostaDto[] | [];
  subgrupos: ProdutosSubGruposListRespostaDto[] | [];
  pontosPreparoImpressao: PontosEntregasListRespostaDto[] | [];
  pontosProcesso: PontosEntregasListRespostaDto[] | [];
}

export class ProdutoListAdminRespostaDto {
  produtos: ProdutoListAdminDto[] | [];
  produtosAgregados: ProdutosAgregados;

  constructor(data: Partial<ProdutoListAdminRespostaDto>) {
    this.produtos = data['produtos'] || [];
    this.produtosAgregados = {
      grupos: data['produtosAgregados']?.['grupos'] || [],
      subgrupos: data['produtosAgregados']?.['subgrupos'] || [],
      pontosPreparoImpressao:
        data['produtosAgregados']?.['pontosPreparoImpressao'] || [],
      pontosProcesso: data['produtosAgregados']?.['pontosProcesso'] || [],
    };
  }
}

// export class ProdutoListAdminRespostaDto {
//   produtos: ProdutoListAdminDto[] | [];
//   grupos: ProdutosGruposListRespostaDto[] | [];
//   subgrupos: ProdutosSubGruposListRespostaDto[] | [];
//   pontosPreparoImpressao: PontosEntregasListRespostaDto[] | [];
//   pontosProcesso: PontosEntregasListRespostaDto[] | [];

//   constructor(data: Partial<ProdutoListAdminRespostaDto>) {
//     this.produtos = data.produtos || [];
//     this.grupos = data.grupos || [];
//     this.subgrupos = data.subgrupos || [];
//     this.pontosPreparoImpressao = data.pontosPreparoImpressao || [];
//     this.pontosProcesso = data.pontosProcesso || [];
//   }
// }
