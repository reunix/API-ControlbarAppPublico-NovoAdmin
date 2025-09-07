import { UsuarioCrudAppPublicoDto } from '../dtos/crud-usuarios-app-publico.dto';

export interface AutenticacaoAppPublicoRepositorio {
  buscarUsuarioAppPublico(
    cpf: string,
    senha: string
  ): Promise<UsuarioCrudAppPublicoDto | null>;

  buscarUsuarioAppPublicoEmail(
    email: string
  ): Promise<UsuarioCrudAppPublicoDto | null>;
}
