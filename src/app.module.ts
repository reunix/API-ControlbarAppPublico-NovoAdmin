import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacaoModulo } from './autenticacao/autenticacao.modulo';
import { ClientesModulo } from './clientes/clientes.modulo';
import { EventosModulo } from './eventos/eventos.modulo';
import { ConsignadoModulo } from './consignados/consignados.modulo';
import { EventoDespesasModulo } from './eventodespesas/eventodespesas.modulo';
import { ProdutosModulo } from './produtos/produtos.modulo';
import { ProdutosEntradasModulo } from './produtosentradas/produtosentradas.modulo';
import { DistribuicaoModulo } from './distribuicao/distribuicao.modulo';
import { FornecedorModulo } from './fornecedores/fornecedores.modulo';
import { ProdutosComposicao } from './produtoscomposicao/produtoscomposicao.modulo';
import { ConfiguracaoAmbiente } from './configuracao.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfiguracaoAmbiente>) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.modelo{.ts,.js}'],
        synchronize: false,
        multipleStatements: true,
      }),
      inject: [ConfigService],
    }),
    AutenticacaoModulo,
    ClientesModulo,
    EventosModulo,
    ConsignadoModulo,
    EventoDespesasModulo,
    ProdutosModulo,
    ProdutosEntradasModulo,
    DistribuicaoModulo,
    FornecedorModulo,
    ProdutosComposicao,
  ],
})
export class AppModulo {}
