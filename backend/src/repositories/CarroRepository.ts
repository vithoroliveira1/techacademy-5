import pool from '../utils/database';
import { Carro, CarroCreate, ListaPaginada } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class CarroRepository {
  async findAll(page: number, limit: number): Promise<ListaPaginada<Carro>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT c.*, m.nome as marca_nome FROM carros c JOIN marcas m ON c.marca_id = m.id LIMIT ? OFFSET ?', [limit, offset]);
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM carros');
    const total = totalRows[0].count;
    return { data: rows as Carro[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findDisponiveis(page: number, limit: number): Promise<ListaPaginada<Carro>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT c.*, m.nome as marca_nome FROM carros c JOIN marcas m ON c.marca_id = m.id WHERE c.status = "disponivel" LIMIT ? OFFSET ?', [limit, offset]);
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM carros WHERE status = "disponivel"');
    const total = totalRows[0].count;
    return { data: rows as Carro[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: number): Promise<Carro | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT c.*, m.nome as marca_nome FROM carros c JOIN marcas m ON c.marca_id = m.id WHERE c.id = ?', [id]);
    return rows.length ? (rows[0] as Carro) : null;
  }

  async create(data: CarroCreate): Promise<Carro> {
    const status = data.status || 'disponivel';
    const [r] = await pool.query<ResultSetHeader>('INSERT INTO carros (modelo,ano,preco,cor,marca_id,status) VALUES (?,?,?,?,?,?)', [data.modelo, data.ano, data.preco, data.cor, data.marca_id, status]);
    return { id: r.insertId, status, ...data } as Carro;
  }

  async update(id: number, data: CarroCreate): Promise<void> {
    const status = data.status || 'disponivel';
    await pool.query('UPDATE carros SET modelo=?, ano=?, preco=?, cor=?, marca_id=?, status=? WHERE id=?', [data.modelo, data.ano, data.preco, data.cor, data.marca_id, status, id]);
  }
  
  async updateStatus(id: number, status: string): Promise<void> {
    await pool.query('UPDATE carros SET status=? WHERE id=?', [status, id]);
  }

  async countVendas(carroId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM vendas WHERE carro_id=?', [carroId]);
    return rows[0].count as number;
  }
  
  async countAlugueis(carroId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM alugueis WHERE carro_id=?', [carroId]);
    return rows[0].count as number;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM carros WHERE id = ?', [id]);
  }
}
