import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacaoModulo } from './domain/autenticacao/autenticacao.modulo';
import { ClientesModulo } from './domain/clientes/clientes.modulo';
import { EventosModulo } from './domain/eventos/eventos.modulo';
import { ConsignadoModulo } from './domain/consignados/consignados.modulo';
import { EventoDespesasModulo } from './domain/eventodespesas/eventodespesas.modulo';
import { ProdutosModulo } from './domain/produtos/produtos.modulo';
import { ProdutosEntradasModulo } from './domain/produtosentradas/produtosentradas.modulo';
import { DistribuicaoModulo } from './domain/distribuicao/distribuicao.modulo';
import { FornecedorModulo } from './domain/fornecedores/fornecedores.modulo';
import { ConfiguracaoAmbiente } from './configuracao.interface';
import { ProdutosComposicao } from './domain/produtoscomposicao/produtoscomposicao.modulo';

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
