export type Role = 'developer' | 'lead';
export type CarroStatus = 'disponivel' | 'alugado';
export type AluguelStatus = 'ativo' | 'finalizado' | 'cancelado';

export interface Usuario { id: number; nome: string; email: string; cpf: string; role: Role; }
export interface UsuarioCreate { nome: string; email: string; senha: string; cpf: string; }
export interface UsuarioUpdate { nome: string; senha?: string; cpf: string; }
export interface UsuarioLogin { email: string; senha: string; }

export interface Marca { id: number; nome: string; pais_origem: string; }
export interface MarcaCreate { nome: string; pais_origem: string; }

export interface Carro {
  id: number;
  modelo: string;
  ano: number;
  preco: number;
  cor: string;
  marca_id: number;
  marca_nome?: string;
  status: CarroStatus;
}
export interface CarroCreate { modelo: string; ano: number; preco: number; cor: string; marca_id: number; }

export interface Venda { id: number; carro_id: number; comprador_nome: string; comprador_cpf: string; valor_venda: number; data_venda: string; }
export interface VendaCreate { carro_id: number; comprador_nome: string; comprador_cpf: string; valor_venda: number; data_venda: string; }

export interface Aluguel {
  id: number;
  carro_id: number;
  usuario_id: number;
  data_inicio: string;
  data_fim: string;
  valor_total: number;
  status: AluguelStatus;
  carro_modelo?: string;
  carro_marca?: string;
}
export interface AluguelCreate { carro_id: number; data_inicio: string; data_fim: string; }

export interface ListaPaginada<T> { data: T[]; paginacao: { page: number; limit: number; total: number; totalPages: number; } }
