import { LoginAppPublicoRespostaDto } from 'domain/autenticacao/dtos/login-app-publico-resposta.dto';
import { UsuarioCrudAppPublicoDto } from '../dtos/crud-usuarios-app-publico.dto';

export interface AutenticacaoAppPublicoRepositorio {
  buscarUsuarioAppPublico(
    cpf: string,
    senha: string
  ): Promise<LoginAppPublicoRespostaDto | null>;

  buscarUsuarioAppPublicoEmail(
    email: string
  ): Promise<UsuarioCrudAppPublicoDto | null>;
}
