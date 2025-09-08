import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
import { EventParticipant } from './domain/chat/modelos/event-participant.modelo';
import { GroupMessage } from './domain/chat/modelos/group-message.modelo';
import { PrivateMessage } from './domain/chat/modelos/private-message.modelo';
import { ChatModule } from './domain/chat/chat.modulo';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/chat/uploads',
    }),
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
    EventParticipant,
    GroupMessage,
    PrivateMessage,
    ChatModule,
  ],
})
export class AppModulo {}
