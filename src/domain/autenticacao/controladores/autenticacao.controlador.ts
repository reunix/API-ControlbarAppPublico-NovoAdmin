import {
  Controller,
  Post,
  Get,
  UsePipes,
  Put,
  Body,
  HttpException,
  HttpStatus,
  Inject,
  HttpCode,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AutenticacaoRepositorio } from '../interfaces/autenticacao-repositorio.interface';
import { LoginRespostaDto } from '../dtos/login-resposta.dto';
import { LoginAdminDto } from '../dtos/login-admin.dto';
import { LoginAppPublicoDto } from 'domain/autenticacao/dtos/login-app-publico.dto';
import { LoginAppPublicoRespostaDto } from 'domain/autenticacao/dtos/login-app-publico-resposta.dto';
import { AutenticacaoAppPublicoRepositorioImpl } from 'domain/autenticacao/repositorios/autenticacao-app-publico.repositorio';
import { SendEmailChangePasswordAppPublicoDto } from 'domain/autenticacao/dtos/send-email-changePassword-app-publico.dto';
import { EmailService } from 'services/email-code-change-password.service';
import { UsuarioCrudAppPublicoDto } from '../dtos/crud-usuarios-app-publico.dto';
import { AutenticacaoUpdateUserAppPublicoRepositorioImpl } from '../repositorios/autenticacao-update-user-app-publico.repositorio';
import { hashPassword } from 'utils';
import { RequestLoginAppPublicoPorEmailDto } from '../dtos/request-login-por-email.dto';
import { SendEmailNewUserAppPublicoDto } from '../dtos/send-email-new-user-app-publico.dto';

@Controller('autenticacao')
export class AutenticacaoControlador {
  constructor(
    @Inject('AutenticacaoRepositorio')
    private readonly repositorio: AutenticacaoRepositorio,
    @Inject('AutenticacaoAppPublicoRepositorio')
    private readonly repositorioLoginAppPublico: AutenticacaoAppPublicoRepositorioImpl,
    @Inject('AutenticacaoUpdateUserAppPublicoRepositorio')
    private readonly repositorioUpdateUserAppPublico: AutenticacaoUpdateUserAppPublicoRepositorioImpl,
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

  @Post('login-app-publico')
  @HttpCode(HttpStatus.OK)
  async loginAppPublico(
    @Body() loginDto: LoginAppPublicoDto
  ): Promise<UsuarioCrudAppPublicoDto | null> {
    const responseUsuario =
      await this.repositorioLoginAppPublico.buscarUsuarioAppPublico(
        loginDto.cpf,
        loginDto.senha
      );

    return responseUsuario;
  }

  @Get('get-user-por-email')
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscarUsuarioPorEmail(
    @Query() buscaUsuarioPoremailDto: RequestLoginAppPublicoPorEmailDto
  ): Promise<UsuarioCrudAppPublicoDto | null> {
    const usuario =
      await this.repositorioLoginAppPublico.buscarUsuarioAppPublicoEmail(
        buscaUsuarioPoremailDto.email
      );

    return usuario;
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
          message: `E-mail não encontrado. Verifique se digitou corretamente ou tente (Criar nova conta).`,
        };
      }

      const result = await this.emailService.sendPasswordResetEmail(
        usuario.usersweb_nome || 'Usuário',
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

  @Post('send-email-new-user-app-publico')
  @HttpCode(HttpStatus.OK)
  async sendEmailCodeNewUserAppPublico(
    @Body() sendEmailDto: SendEmailNewUserAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      const usuario =
        await this.repositorioLoginAppPublico.buscarUsuarioAppPublicoEmail(
          sendEmailDto.email
        );

      if (usuario) {
        return {
          success: false,
          message: `E-mail já encontrado. Verifique se digitou corretamente ou tente (Esqueci minha senha).`,
        };
      }
      const result = await this.emailService.sendNewUserEmail(
        sendEmailDto.nome,
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

  @Put('/update-user-app-publico')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUserAppPublico(
    @Body() atualizaProdutoDto: UsuarioCrudAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      atualizaProdutoDto.usersweb_senha = await hashPassword(
        atualizaProdutoDto.usersweb_senha
      );

      await this.repositorioUpdateUserAppPublico.atualizarUser(
        atualizaProdutoDto
      );

      return { success: true, message: 'Cadastro atualizado com sucesso.' };
    } catch (error: unknown) {
      console.error('Erro ao tentar atualizar cadastro: ', error);
      return { success: false, message: 'Erro ao tentar atualizar cadastro' };
    }
  }

  @Post('/create-user-app-publico')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUserAppPublico(
    @Body() atualizaProdutoDto: UsuarioCrudAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      atualizaProdutoDto.usersweb_senha = await hashPassword(
        atualizaProdutoDto.usersweb_senha
      );

      await this.repositorioUpdateUserAppPublico.createUser(atualizaProdutoDto);

      return { success: true, message: 'Cadastro atualizado com sucesso.' };
    } catch (error: unknown) {
      console.error('Erro ao tentar atualizar cadastro: ', error);
      return { success: false, message: 'Erro ao tentar atualizar cadastro' };
    }
  }
}
