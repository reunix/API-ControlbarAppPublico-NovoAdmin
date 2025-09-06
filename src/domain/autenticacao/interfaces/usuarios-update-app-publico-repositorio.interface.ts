import { UsuarioCrudAppPublicoDto } from 'domain/autenticacao/dtos/crud-usuarios-app-publico.dto';
import { LoginAppPublicoRespostaDto } from '../dtos/login-app-publico-resposta.dto';

export interface UserUpdateAppPublicoRepositorio {
  atualizarUser(
    usuario: UsuarioCrudAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto>;
}
