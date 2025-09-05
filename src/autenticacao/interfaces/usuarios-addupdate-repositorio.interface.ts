import { ProdutoModel } from 'produtos/modelos/produtos-update.modelo';
import { UsuarioCrudDto } from 'autenticacao/dtos/crud-usuarios.dto';

export interface UsuariosCrudRepositorio {
  atualizarUsuarios(usuario: UsuarioCrudDto): Promise<ProdutoModel>;
  deletarUsuario(consignadoId: number): Promise<void>;
}
