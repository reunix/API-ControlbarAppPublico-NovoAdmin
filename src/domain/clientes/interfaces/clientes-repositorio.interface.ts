import { Cliente } from '../modelos/cliente.modelo';

export interface ClientesRepositorio {
  buscarPorNome(nomePadrao?: string): Promise<Cliente[]>;
}
