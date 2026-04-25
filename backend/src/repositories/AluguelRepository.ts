import pool from '../utils/database';
import { Aluguel, AluguelCreate, ListaPaginada } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AluguelRepository {
  async findAll(page: number, limit: number): Promise<ListaPaginada<Aluguel>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT a.*, c.modelo as carro_modelo, m.nome as carro_marca FROM alugueis a JOIN carros c ON a.carro_id = c.id JOIN marcas m ON c.marca_id = m.id LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM alugueis');
    const total = totalRows[0].count;
    return { data: rows as Aluguel[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findByUsuario(usuarioId: number, page: number, limit: number): Promise<ListaPaginada<Aluguel>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT a.*, c.modelo as carro_modelo, m.nome as carro_marca FROM alugueis a JOIN carros c ON a.carro_id = c.id JOIN marcas m ON c.marca_id = m.id WHERE a.usuario_id = ? LIMIT ? OFFSET ?',
      [usuarioId, limit, offset]
    );
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM alugueis WHERE usuario_id = ?', [usuarioId]);
    const total = totalRows[0].count;
    return { data: rows as Aluguel[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: number): Promise<Aluguel | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT a.*, c.modelo as carro_modelo, m.nome as carro_marca FROM alugueis a JOIN carros c ON a.carro_id = c.id JOIN marcas m ON c.marca_id = m.id WHERE a.id = ?',
      [id]
    );
    return rows.length ? (rows[0] as Aluguel) : null;
  }

  async create(data: AluguelCreate): Promise<Aluguel> {
    const [r] = await pool.query<ResultSetHeader>(
      'INSERT INTO alugueis (carro_id, usuario_id, data_inicio, data_fim, valor_total, status) VALUES (?,?,?,?,?,?)',
      [data.carro_id, data.usuario_id, data.data_inicio, data.data_fim, data.valor_total, 'ativo']
    );
    return { id: r.insertId, status: 'ativo', ...data } as Aluguel;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await pool.query('UPDATE alugueis SET status=? WHERE id=?', [status, id]);
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM alugueis WHERE id = ?', [id]);
  }
}
