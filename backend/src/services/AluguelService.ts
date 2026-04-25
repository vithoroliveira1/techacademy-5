import { AluguelRepository } from '../repositories/AluguelRepository';
import { CarroRepository } from '../repositories/CarroRepository';
import { Aluguel, AluguelCreate, ListaPaginada } from '../types';

export class AluguelService {
  private repo = new AluguelRepository();
  private carroRepo = new CarroRepository();

  async listar(page: number, limit: number): Promise<ListaPaginada<Aluguel>> {
    return this.repo.findAll(page, limit);
  }

  async listarMeus(usuarioId: number, page: number, limit: number): Promise<ListaPaginada<Aluguel>> {
    return this.repo.findByUsuario(usuarioId, page, limit);
  }

  async obter(id: number): Promise<Aluguel> {
    const a = await this.repo.findById(id);
    if (!a) throw new Error('Não encontrado');
    return a;
  }

  async criar(usuarioId: number, data: AluguelCreate): Promise<Aluguel> {
    if (!data.carro_id || !data.data_inicio || !data.data_fim) throw new Error('Campos faltando');
    
    const carro = await this.carroRepo.findById(data.carro_id);
    if (!carro) throw new Error('Carro inexistente');
    if (carro.status !== 'disponivel') throw new Error('Carro não está disponível');

    const dataInicio = new Date(data.data_inicio);
    const dataFim = new Date(data.data_fim);
    if (dataFim <= dataInicio) throw new Error('Data de fim deve ser posterior a data de início');

    const dias = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 3600 * 24));
    const valorTotal = dias * carro.preco;

    const aluguelData = {
      carro_id: data.carro_id,
      usuario_id: usuarioId,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      valor_total: valorTotal
    };

    const aluguel = await this.repo.create(aluguelData);
    await this.carroRepo.updateStatus(carro.id, 'alugado');
    return aluguel;
  }

  async finalizar(id: number): Promise<void> {
    const aluguel = await this.obter(id);
    if (aluguel.status !== 'ativo') throw new Error('Aluguel já está finalizado ou cancelado');
    
    await this.repo.updateStatus(id, 'finalizado');
    await this.carroRepo.updateStatus(aluguel.carro_id, 'disponivel');
  }

  async deletar(id: number): Promise<void> {
    const aluguel = await this.obter(id);
    if (aluguel.status === 'ativo') {
       // Se deletar um ativo, volta o carro pra disponivel
       await this.carroRepo.updateStatus(aluguel.carro_id, 'disponivel');
    }
    await this.repo.delete(id);
  }
}
