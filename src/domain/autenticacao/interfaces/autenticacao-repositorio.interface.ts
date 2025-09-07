import { UsuarioAdmin } from '../modelos/usuario-admin.modelo';

export interface AutenticacaoRepositorio {
  buscarUsuarioPorLoginESenha(
    email: string,
    senha: string
  ): Promise<UsuarioAdmin | null>;
}
