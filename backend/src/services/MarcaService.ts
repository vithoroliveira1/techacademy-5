import { MarcaRepository } from '../repositories/MarcaRepository';
import { Marca, MarcaCreate, ListaPaginada } from '../types';

export class MarcaService {
  private repo = new MarcaRepository();

  async listar(page: number, limit: number): Promise<ListaPaginada<Marca>> {
    return this.repo.findAll(page, limit);
  }
  async obter(id: number): Promise<Marca> {
    const m = await this.repo.findById(id);
    if (!m) throw new Error('Não encontrado');
    return m;
  }
  async criar(data: MarcaCreate): Promise<Marca> {
    if (!data.nome || !data.pais_origem) throw new Error('Campos faltando');
    return this.repo.create(data);
  }
  async atualizar(id: number, data: MarcaCreate): Promise<void> {
    if (!data.nome || !data.pais_origem) throw new Error('Campos faltando');
    await this.obter(id);
    await this.repo.update(id, data);
  }
  async deletar(id: number): Promise<void> {
    await this.obter(id);
    const count = await this.repo.countCarros(id);
    if (count > 0) throw new Error('Vínculo existente');
    await this.repo.delete(id);
  }
}
