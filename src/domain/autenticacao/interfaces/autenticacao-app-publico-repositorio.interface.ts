import { LoginAppPublicoRespostaDto } from 'domain/autenticacao/dtos/login-app-publico-resposta.dto';
import { UsuarioAppPublio } from 'domain/autenticacao/modelos/usuario-app-publico.modelo';

export interface AutenticacaoAppPublicoRepositorio {
  buscarUsuarioAppPublico(
    cpf: string,
    senha: string
  ): Promise<LoginAppPublicoRespostaDto | null>;

  buscarUsuarioAppPublicoEmail(email: string): Promise<UsuarioAppPublio | null>;
}
