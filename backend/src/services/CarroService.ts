import { CarroRepository } from '../repositories/CarroRepository';
import { MarcaRepository } from '../repositories/MarcaRepository';
import { Carro, CarroCreate, ListaPaginada } from '../types';

export class CarroService {
  private repo = new CarroRepository();
  private marcaRepo = new MarcaRepository();

  async listar(page: number, limit: number): Promise<ListaPaginada<Carro>> {
    return this.repo.findAll(page, limit);
  }
  async listarDisponiveis(page: number, limit: number): Promise<ListaPaginada<Carro>> {
    return this.repo.findDisponiveis(page, limit);
  }
  async obter(id: number): Promise<Carro> {
    const c = await this.repo.findById(id);
    if (!c) throw new Error('Não encontrado');
    return c;
  }
  async criar(data: CarroCreate): Promise<Carro> {
    this.validarCampos(data);
    const marca = await this.marcaRepo.findById(data.marca_id);
    if (!marca) throw new Error('Marca inexistente');
    return this.repo.create(data);
  }
  private validarCampos(data: CarroCreate): void {
    if (!data.modelo || !data.ano || !data.preco || !data.cor || !data.marca_id) throw new Error('Campos faltando');
  }
  async atualizar(id: number, data: CarroCreate): Promise<void> {
    this.validarCampos(data);
    await this.obter(id);
    const marca = await this.marcaRepo.findById(data.marca_id);
    if (!marca) throw new Error('Marca inexistente');
    await this.repo.update(id, data);
  }
  async deletar(id: number): Promise<void> {
    await this.obter(id);
    const countVendas = await this.repo.countVendas(id);
    if (countVendas > 0) throw new Error('Vínculo existente');
    const countAlugueis = await this.repo.countAlugueis(id);
    if (countAlugueis > 0) throw new Error('Vínculo existente');
    await this.repo.delete(id);
  }
}
