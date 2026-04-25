import { VendaRepository } from '../repositories/VendaRepository';
import { CarroRepository } from '../repositories/CarroRepository';
import { Venda, VendaCreate, ListaPaginada } from '../types';
import { validarCPF } from '../utils/validacoes';

export class VendaService {
  private repo = new VendaRepository();
  private carroRepo = new CarroRepository();

  async listar(page: number, limit: number): Promise<ListaPaginada<Venda>> { return this.repo.findAll(page, limit); }
  async obter(id: number): Promise<Venda> {
    const v = await this.repo.findById(id);
    if (!v) throw new Error('Não encontrado');
    return v;
  }
  private async validar(data: VendaCreate): Promise<void> {
    if (!data.carro_id || !data.comprador_nome || !data.comprador_cpf || !data.valor_venda || !data.data_venda) throw new Error('Campos faltando');
    if (!validarCPF(data.comprador_cpf)) throw new Error('CPF inválido');
    const c = await this.carroRepo.findById(data.carro_id);
    if (!c) throw new Error('Carro inexistente');
  }
  async criar(data: VendaCreate): Promise<Venda> {
    await this.validar(data);
    return this.repo.create(data);
  }
  async atualizar(id: number, data: VendaCreate): Promise<void> {
    await this.obter(id);
    await this.validar(data);
    await this.repo.update(id, data);
  }
  async deletar(id: number): Promise<void> {
    await this.obter(id);
    await this.repo.delete(id);
  }
}
