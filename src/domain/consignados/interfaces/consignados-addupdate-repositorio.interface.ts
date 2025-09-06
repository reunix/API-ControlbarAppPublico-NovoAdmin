import { AtualizaConsignadoDto } from '../dtos/atualiza-consignados.dto';

export interface ConsignadosAddUpdateRepositorio {
  atualizarConsignados(consignados: AtualizaConsignadoDto[]): Promise<void>;
  deletarConsignado(consignadoId: number): Promise<void>;
}
