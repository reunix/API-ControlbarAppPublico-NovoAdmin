// src/services/email.service.ts
import * as nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_SEND_EMAIL,
        pass: process.env.PASSWORD_SEND_EMAIL,
      },
    });
  }

  // Método genérico para enviar e-mails
  async sendMail(options: SendEmailOptions) {
    try {
      const mailOptions = {
        from: '"Controlbar" <controlbar@controlbar.app.br>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);

      return { success: true, message: 'E-mail enviado com sucesso.' };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return { success: false, message: 'Erro ao enviar e-mail' };
    }
  }

  // Método específico para redefinição de senha
  async sendPasswordResetEmail(
    userName: string,
    email: string,
    codigo: string
  ) {
    const html = `
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
                <tr>
                  <td style="padding: 20px 20px 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                    <img src="https://static.wixstatic.com/media/18e304_316dc72c5c1148a89bfc2c378b59c289~mv2.png/v1/fill/w_180,h_140,al_c,lg_1,q_85,enc_avif,quality_auto/MARCA_P.png" alt="Controlbar" style="max-width: 120px; height: auto; margin-bottom: 10px;">
                  </td>
                </tr>
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
                        ${codigo}
                      </div>
                    </div>
                    <p style="font-size: 14px; color: #666666; margin-bottom: 15px;">
                      Este código é válido por <strong>5 minutos</strong>. Por segurança, não compartilhe este código com ninguém.
                    </p>
                    <p style="font-size: 14px; color: #666666; margin-bottom: 20px;">
                      Se você não solicitou esta verificação, entre em contato com nosso suporte em <a href="mailto:suporte@controlbar.app.br" style="color: #007AFF; text-decoration: none;">suporte@controlbar.app.br</a> ou ignore este e-mail.
                    </p>
                  </td>
                </tr>
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
    `;

    return this.sendMail({
      to: email,
      subject: 'Redefinição de Senha - Controlbar',
      html,
    });
  }
}
