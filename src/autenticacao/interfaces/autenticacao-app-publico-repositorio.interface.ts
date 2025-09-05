import { LoginAppPublicoRespostaDto } from 'autenticacao/dtos/login-app-publico-resposta.dto';

export interface AutenticacaoAppPublicoRepositorio {
  buscarUsuarioAppPublico(
    cpf: string,
    senha: string
  ): Promise<LoginAppPublicoRespostaDto>;
}
