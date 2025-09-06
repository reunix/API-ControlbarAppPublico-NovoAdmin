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
import { LoginAppPublicoDto } from 'autenticacao/dtos/login-app-publico.dto';
import { LoginAppPublicoRespostaDto } from 'autenticacao/dtos/login-app-publico-resposta.dto';
import { AutenticacaoAppPublicoRepositorioImpl } from 'autenticacao/repositorios/autenticacao-app-publico.repositorio';
import { SendEmailChangePasswordAppPublicoDto } from 'autenticacao/dtos/send-email-changePassword-app-publico.dto';
// import nodemailer from 'nodemailer';
import * as nodemailer from 'nodemailer'; // Importação CommonJS para compatibilidade
// import { UsuariosCrudRepositorio } from 'autenticacao/interfaces/usuarios-addupdate-repositorio.interface';
//import { UsuarioCrudDto } from 'autenticacao/dtos/crud-usuarios.dto';

@Controller('autenticacao')
export class AutenticacaoControlador {
  constructor(
    @Inject('AutenticacaoRepositorio')
    private readonly repositorio: AutenticacaoRepositorio,
    @Inject('AutenticacaoAppPublicoRepositorio')
    private readonly repositorioLoginAppPublico: AutenticacaoAppPublicoRepositorioImpl
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

      const userName = usuario.nome;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_SEND_EMAIL,
          pass: process.env.PASSWORD_SEND_EMAIL,
        },
      });

      const mailOptions = {
        from: '"Controlbar" <controlbar@controlbar.app.br>',
        to: sendEmailDto.email,
        subject: 'Redefinição de Senha - Controlbar',
        text: `Olá,\n\nVocê solicitou a redefinição de senha para sua conta no Controlbar. Para prosseguir, utilize o código de verificação abaixo no aplicativo:\n\nCódigo de verificação: ${sendEmailDto.codigo}\n\nEste código é válido por 15 minutos. Por motivos de segurança, não compartilhe este código com ninguém. Seus dados estão protegidos, e nosso sistema utiliza criptografia para garantir sua privacidade.\n\nSe você não solicitou esta alteração, entre em contato imediatamente com nossa equipe de suporte em suporte@controlbar.app.br ou ignore este e-mail.\n\nObrigado por usar o Controlbar!\n\nAtenciosamente,\nEquipe Controlbar`,
        html: `
         <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificação de Código - Controlbar</title>
          </head>
          <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #333333; margin: 0; padding: 0; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px;">
                    <!-- Header com Logotipo -->
                    <tr>
                      <td style="padding: 20px 20px 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                        <img src="https://static.wixstatic.com/media/18e304_316dc72c5c1148a89bfc2c378b59c289~mv2.png/v1/fill/w_180,h_140,al_c,lg_1,q_85,enc_avif,quality_auto/MARCA_P.png" alt="Controlbar" style="max-width: 120px; height: auto; margin-bottom: 10px;">
                      </td>
                    </tr>
                    <!-- Corpo do E-mail -->
                    <tr>
                      <td style="padding: 20px;">
                        <p style="font-size: 16px; color: #333333; margin-bottom: 15px;">
                          Olá, <strong>${userName}</strong>,
                        </p>
                        <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">
                          Recebemos uma solicitação para redefinir a senha da sua conta Controlbar. Para prosseguir, utilize o código de verificação abaixo no aplicativo:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                          <div style="display: inline-block; background-color: #007AFF; color: #ffffff; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;">
                            ${sendEmailDto.codigo}
                          </div>
                        </div>
                        <p style="font-size: 14px; color: #666666; margin-bottom: 15px;">
                          Este código é válido por <strong>5 minutos</strong>. Por segurança, não compartilhe este código com ninguém. Seus dados estão protegidos com criptografia avançada.
                        </p>
                        <p style="font-size: 14px; color: #666666; margin-bottom: 20px;">
                          Se você não solicitou esta verificação, entre em contato com nosso suporte em <a href="mailto:suporte@controlbar.app.br" style="color: #007AFF; text-decoration: none;">suporte@controlbar.app.br</a> ou ignore este e-mail.
                        </p>
                      </td>
                    </tr>
                    <!-- Rodapé -->
                    <tr>
                      <td style="padding: 20px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999;">
                        <p style="margin: 0;">
                          &copy; ${new Date().getFullYear()} Controlbar. Todos os direitos reservados.<br>
                          <a href="https://www.sistemacontrolbar.com.br/" style="color: #007AFF; text-decoration: none;">www.sistemacontrolbar.com.br</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'E-mail enviado com sucesso.',
      };
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
