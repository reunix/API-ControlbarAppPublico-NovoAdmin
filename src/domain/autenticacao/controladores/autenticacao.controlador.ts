import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Inject,
  HttpCode,
} from '@nestjs/common';
import { AutenticacaoRepositorio } from '../interfaces/autenticacao-repositorio.interface';
import { LoginRespostaDto } from '../dtos/login-resposta.dto';
import { LoginAdminDto } from '../dtos/login-admin.dto';
import { LoginAppPublicoDto } from 'domain/autenticacao/dtos/login-app-publico.dto';
import { LoginAppPublicoRespostaDto } from 'domain/autenticacao/dtos/login-app-publico-resposta.dto';
import { AutenticacaoAppPublicoRepositorioImpl } from 'domain/autenticacao/repositorios/autenticacao-app-publico.repositorio';
import { SendEmailChangePasswordAppPublicoDto } from 'domain/autenticacao/dtos/send-email-changePassword-app-publico.dto';
import { EmailService } from 'services/email-code-change-password.service';
// import nodemailer from 'nodemailer';
// import * as nodemailer from 'nodemailer'; // Importação CommonJS para compatibilidade
// import { UsuariosCrudRepositorio } from 'autenticacao/interfaces/usuarios-addupdate-repositorio.interface';
//import { UsuarioCrudDto } from 'autenticacao/dtos/crud-usuarios.dto';

@Controller('autenticacao')
export class AutenticacaoControlador {
  constructor(
    @Inject('AutenticacaoRepositorio')
    private readonly repositorio: AutenticacaoRepositorio,
    @Inject('AutenticacaoAppPublicoRepositorio')
    private readonly repositorioLoginAppPublico: AutenticacaoAppPublicoRepositorioImpl,
    private readonly emailService: EmailService
  ) {}

  @Post('admin')
  @HttpCode(HttpStatus.OK) // Força o status 200 OK
  async login(@Body() loginDto: LoginAdminDto): Promise<LoginRespostaDto> {
    const usuario = await this.repositorio.buscarUsuarioPorLoginESenha(
      loginDto.email,
      loginDto.senha
    );
    if (!usuario) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    if (usuario.admin == 'N') {
      throw new HttpException(
        'Tipo de usuário sem permissão.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const returnData = new LoginRespostaDto({
      id: usuario.id,
      name: usuario.nome || usuario.login,
      telefone: usuario.telefone,
      email: usuario.email,
      global: usuario.global == 'S',
      admin: usuario.admin == 'S',
      tecnico: usuario.admin == 'T',
      empresas: [
        {
          nome: 'DANCETERIA',
          id: 888,
        },
      ],
      image: '',
    });

    return returnData;
  }

  @Post('app-publico')
  @HttpCode(HttpStatus.OK)
  async loginAppPublico(
    @Body() loginDto: LoginAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    return await this.repositorioLoginAppPublico.buscarUsuarioAppPublico(
      loginDto.cpf,
      loginDto.senha
    );
  }

  @Post('send-email-change-password-app-publico')
  @HttpCode(HttpStatus.OK)
  async sendEmailChangePasswordAppPublico(
    @Body() sendEmailDto: SendEmailChangePasswordAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      const usuario =
        await this.repositorioLoginAppPublico.buscarUsuarioAppPublicoEmail(
          sendEmailDto.email
        );

      if (!usuario) {
        return {
          success: false,
          message: `E-mail não encontrado. Verifique se digitou corretamente ou crie uma nova conta.`,
        };
      }

      const result = await this.emailService.sendPasswordResetEmail(
        usuario.nome || 'Usuário',
        sendEmailDto.email,
        sendEmailDto.codigo
      );

      if (result.success) {
        return { success: true, message: 'E-mail enviado com sucesso.' };
      } else {
        return { success: false, message: 'Erro ao enviar e-mail.' };
      }
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error);
      return { success: false, message: 'Erro ao enviar e-mail' };
    }
  }

  // @Put('/addupdate')
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async atualizarConsignados(
  //   @Body() atualizaProdutoDto: UsuarioCrudDto
  // ): Promise<UsuarioCrudDto> {
  //   try {
  //     const { usuario } = atualizaProdutoDto;

  //     // Validar se o array de consignados não está vazio
  //     if (!usuario) {
  //       throw new HttpException(
  //         'Nenhum produto fornecido para atualização',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     console.log('produto', usuario);

  //     // Chamar o método do repositório para atualizar os consignados
  //     const returnUsuarioData =
  //       await this.repositorioAddUPdateUsuarios.atualizarUsuarios(usuario);
  //     return returnUsuarioData;

  //     // this.logger.log(`Consignados atualizados com sucesso.`);
  //   } catch (error: unknown) {
  //     let errorMessage = 'Erro desconhecido';
  //     let errorStack: string | undefined;

  //     if (error instanceof Error) {
  //       errorMessage = error.message;
  //       errorStack = error.stack;
  //     }

  //     this.logger.error(
  //       `Erro ao atualizar produto: ${errorMessage}`,
  //       errorStack
  //     );
  //     throw new HttpException(
  //       'Erro ao atualizar produto',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }
}
