import { Usuario } from '../modelos/usuario.modelo';

export interface AutenticacaoRepositorio {
  buscarUsuarioPorLoginESenha(
    email: string,
    senha: string
  ): Promise<Usuario | null>;
}
