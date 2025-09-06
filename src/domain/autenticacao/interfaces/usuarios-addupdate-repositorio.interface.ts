import { ProdutoModel } from 'domain/produtos/modelos/produtos-update.modelo';
import { UsuarioCrudDto } from 'domain/autenticacao/dtos/crud-usuarios.dto';

export interface UsuariosCrudRepositorio {
  atualizarUsuarios(usuario: UsuarioCrudDto): Promise<ProdutoModel>;
  deletarUsuario(consignadoId: number): Promise<void>;
}
